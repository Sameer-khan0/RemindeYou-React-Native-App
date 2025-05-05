import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

const DropSheet = ({ visible, onClose, children }) => {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  // Show or hide the sheet based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Called when user swipes down to close
  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  // Render semi-transparent background
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  // 👇 Only render if visible is true
  if (!visible) return null;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheetContent}>{children}</BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    padding: 24,
  },
});

export default DropSheet;
