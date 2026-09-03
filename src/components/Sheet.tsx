/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useMemo,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from '../context/ThemeContext';

interface SheetProps {
  isVisible: boolean;
  onClose: () => void;
  sheetHeight?: string | number;
  children: ReactNode;
}

const Sheet: React.FC<SheetProps> = ({
  isVisible,
  onClose,
  sheetHeight = '45%',
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { colors } = useTheme();

  const snapPoints = useMemo(() => [sheetHeight], [sheetHeight]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // 👈 let the index prop drive open/close
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
    </BottomSheet>
  );
};

export default Sheet;
