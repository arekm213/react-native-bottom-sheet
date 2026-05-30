#!/usr/bin/env bash
#
# `bun ios` wrapper that works around a long-standing @expo/cli bug.
#
# `expo run:ios` builds the app fine, then locates the built `.app` by scraping
# xcodebuild's stdout for `CONFIGURATION_BUILD_DIR` / `UNLOCALIZED_RESOURCES_FOLDER_PATH`.
# That scrape is flaky: it often stitches together a wrong path, and on a no-op
# incremental build (nothing recompiled, so the script phases emit no env lines)
# it finds nothing at all -- failing *after a successful build* with one of:
#
#   Error: ENOENT: ... /ReactNativeBottomSheet.app/Info.plist
#   CommandError: Malformed xcodebuild results: app binary path was not generated
#
# When that happens the binary does exist, so we locate it deterministically from
# `xcodebuild -showBuildSettings` (TARGET_BUILD_DIR + FULL_PRODUCT_NAME), install
# it on the booted simulator, and start Metro ourselves. On a clean run where
# `expo run:ios` succeeds, everything below the first `if` is skipped.
set -euo pipefail
cd "$(dirname "$0")/.."

# CocoaPods aborts with an Encoding::CompatibilityError without a UTF-8 locale.
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

# Happy path: if expo can build *and* launch, we're done (it keeps Metro running).
if bunx expo run:ios "$@"; then
  exit 0
fi

echo
echo "▸ expo run:ios failed at the launch step; applying binary-path fallback."

workspace=$(ls -d ios/*.xcworkspace | head -1)
scheme=$(basename "$workspace" .xcworkspace)
settings=$(xcodebuild -workspace "$workspace" -scheme "$scheme" \
  -configuration Debug -sdk iphonesimulator -showBuildSettings 2>/dev/null)
setting() { awk -F' = ' -v k=" $1 =" 'index($0, k) { print $2; exit }' <<<"$settings"; }

app="$(setting TARGET_BUILD_DIR)/$(setting FULL_PRODUCT_NAME)"
bundle_id=$(setting PRODUCT_BUNDLE_IDENTIFIER)

if [[ ! -d "$app" ]]; then
  echo "✗ No built app at: $app" >&2
  echo "  The native build did not complete -- rerun and look for real errors." >&2
  exit 1
fi

# Make sure a simulator is booted.
if ! xcrun simctl list devices booted | grep -q Booted; then
  open -a Simulator
  until xcrun simctl list devices booted | grep -q Booted; do sleep 1; done
fi

echo "▸ Installing $bundle_id"
xcrun simctl install booted "$app"

# Launch the app once Metro is serving, while Metro runs in the foreground
# (so its logs stream to the terminal and Ctrl-C stops it, as with expo run:ios).
(
  for _ in $(seq 1 60); do
    curl -sf http://localhost:8081/status >/dev/null 2>&1 && break
    sleep 1
  done
  echo "▸ Launching $bundle_id"
  xcrun simctl launch booted "$bundle_id" >/dev/null || true
  open -a Simulator
) &

exec bunx expo start
