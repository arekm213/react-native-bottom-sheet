import { useState, type ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { runOnUI, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomSheetNativeComponent from './BottomSheetNativeComponent';
import { type Detent, resolveDetent } from './bottomSheetUtils';
export type { Detent, DetentValue } from './bottomSheetUtils';
export { programmatic } from './bottomSheetUtils';

export interface BottomSheetProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  detents?: Detent[];
  index: number;
  animateIn?: boolean;
  onIndexChange?: (index: number) => void;
  position?: SharedValue<number>;
}

export const BottomSheet = ({
  children,
  style,
  detents = [0, 'max'],
  index,
  animateIn = true,
  onIndexChange,
  position,
}: BottomSheetProps) => {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maxHeight = screenHeight - insets.top;
  const [contentHeight, setContentHeight] = useState(0);

  const resolvedDetents = detents.map((detent) => {
    const value = resolveDetent(detent, contentHeight, maxHeight);
    return {
      height: Math.max(0, Math.min(value, maxHeight)),
      programmatic: isDetentProgrammatic(detent),
    };
  });

  const handleSentinelLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.y);
  };

  const clampedIndex = Math.max(0, Math.min(index, resolvedDetents.length - 1));
  const isCollapsed = (resolvedDetents[clampedIndex]?.height ?? 0) === 0;
  const sheetPointerEvents = isCollapsed ? 'none' : 'box-none';

  const handleIndexChange = (event: { nativeEvent: { index: number } }) => {
    onIndexChange?.(event.nativeEvent.index);
  };

  const handlePositionChange = (event: {
    nativeEvent: { position: number };
  }) => {
    if (position !== undefined) {
      const height = event.nativeEvent.position;
      runOnUI(() => {
        'worklet';
        position.set(height);
      })();
    }
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <BottomSheetNativeComponent
        pointerEvents={sheetPointerEvents}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: maxHeight,
          },
          style,
        ]}
        detents={resolvedDetents}
        index={index}
        animateIn={animateIn}
        onIndexChange={handleIndexChange}
        onPositionChange={handlePositionChange}
      >
        <View collapsable={false} style={{ flex: 1 }} pointerEvents="box-none">
          {children}
          <View onLayout={handleSentinelLayout} pointerEvents="none" />
        </View>
      </BottomSheetNativeComponent>
    </View>
  );
};

function isDetentProgrammatic(detent: Detent): boolean {
  if (typeof detent === 'object' && detent !== null) {
    return detent.programmatic === true;
  }
  return false;
}
