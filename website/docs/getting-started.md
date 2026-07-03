---
id: getting-started
title: Getting started
sidebar_position: 3
---

# Getting started

1. Install React Native Bottom Sheet:

   ```sh
   npm i @swmansion/react-native-bottom-sheet
   ```

2. Ensure the peer dependency is installed:

   ```sh
   npm i react-native-safe-area-context
   ```

3. Wrap your app with `BottomSheetProvider`:

   ```tsx
   const App = () => <BottomSheetProvider>{/* ... */}</BottomSheetProvider>;
   ```
