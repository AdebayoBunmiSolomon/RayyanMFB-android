/* eslint-disable react-hooks/exhaustive-deps */
// import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   RefreshControlProps,
//   StatusBar,
//   ViewStyle,
// } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { ScrollView, View } from 'tamagui';

// import { useAppSelector } from '../hooks/hook';
// import { hideSheet } from '../slices/appSlice';
// import { SelectDataProps } from '../types';
// import SimpleSheet from './SimpleSheet';
// import SelectSheetContent from './SelectSheetContent';
// import TransactionHistorySheet from './TransactionHistorySheet';
// import BeneficiarySheetContent from './BeneficiarySheetContent';
// import { useTheme } from '../context/ThemeContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import NavBar from './NavBar';

// interface PageContainerProps {
//   children: ReactNode;
//   scrollable?: boolean;
//   style?: ViewStyle;
//   enableAppBar?: boolean;
//   setOptionsModal?: (arg0: boolean) => void;
//   photo?: string;
//   refreshControl?: ReactElement<RefreshControlProps, string>;
// }

// const PageContainer: React.FC<PageContainerProps> = ({
//   children,
//   scrollable = true,
//   style,
//   setOptionsModal,
//   photo,
//   enableAppBar = false,
//   refreshControl,
// }) => {
//   const dispatch = useDispatch();
//   const { data, isVisible, type, title } = useAppSelector(
//     state => state.app.sheet,
//   );
//   const { colors, theme } = useTheme();

//   const handleCloseSheet = () => {
//     dispatch(hideSheet());
//   };

//   useEffect(() => {
//     return () => {
//       handleCloseSheet();
//     };
//   }, []);

//   const headerOffset = useMemo(() => (Platform.OS === 'ios' ? 64 : 0), []);

//   return (
//     <SafeAreaView style={[styles.container(colors.background), style]}>
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={headerOffset}
//         enabled
//       >
//         <StatusBar
//           barStyle={theme !== 'dark' ? 'dark-content' : 'light-content'}
//         />
//         <View style={{ flex: 1 }}>
//           {enableAppBar && (
//             <NavBar
//               profilePicUpdate={() => setOptionsModal?.(true)}
//               photo={photo}
//             />
//           )}
//           {scrollable ? (
//             <ScrollView
//               paddingTop={enableAppBar ? 0 : 16}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.scrollViewContent}
//               keyboardShouldPersistTaps="always"
//               keyboardDismissMode="on-drag"
//               refreshControl={refreshControl}
//               onScrollBeginDrag={Keyboard.dismiss}
//               scrollEventThrottle={16}
//               bounces={true}
//               alwaysBounceVertical={false}
//               nestedScrollEnabled
//               removeClippedSubviews={false}
//             >
//               {children}
//             </ScrollView>
//           ) : (
//             <View style={styles.content}>{children}</View>
//           )}
//         </View>

//         {isVisible && title ? (
//           <SimpleSheet isVisible={isVisible} onClose={handleCloseSheet}>
//             {type === 'select' && (
//               <SelectSheetContent
//                 data={data as SelectDataProps[]}
//                 title={title}
//               />
//             )}
//             {type === 'searchTransaction' && <TransactionHistorySheet />}
//             {type === 'beneficiary' && (
//               <BeneficiarySheetContent
//                 data={
//                   data as {
//                     options: SelectDataProps[];
//                     type: 'bill' | 'transfer';
//                     onPress?: (value: string | number) => void;
//                   }
//                 }
//                 title={title}
//               />
//             )}
//           </SimpleSheet>
//         ) : null}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = {
//   container: (backgroundColor: string) => ({
//     flexGrow: 1,
//     backgroundColor,
//   }),
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
// };

// export default PageContainer;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControlProps,
  StatusBar,
  ViewStyle,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { ScrollView, View } from 'tamagui';

import { useAppSelector } from '../hooks/hook';
import { hideSheet } from '../slices/appSlice';
import { SelectDataProps } from '../types';
import SimpleSheet from './SimpleSheet';
import SelectSheetContent from './SelectSheetContent';
import TransactionHistorySheet from './TransactionHistorySheet';
import BeneficiarySheetContent from './BeneficiarySheetContent';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from './NavBar';

interface PageContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  enableAppBar?: boolean;
  setOptionsModal?: (arg0: boolean) => void;
  photo?: string;
  refreshControl?: ReactElement<RefreshControlProps, string>;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  scrollable = true,
  style,
  setOptionsModal,
  photo,
  enableAppBar = false,
  refreshControl,
}) => {
  const dispatch = useDispatch();
  const { data, isVisible, type, title } = useAppSelector(
    state => state.app.sheet,
  );
  const { colors, theme } = useTheme();

  const handleCloseSheet = () => {
    dispatch(hideSheet());
  };

  useEffect(() => {
    return () => {
      handleCloseSheet();
    };
  }, []);

  const headerOffset = useMemo(() => (Platform.OS === 'ios' ? 64 : 0), []);

  // Shared content for both platform branches below.
  // Android relies on `android:windowSoftInputMode="adjustResize"` (set in
  // AndroidManifest.xml) to handle keyboard resizing natively, so it must
  // NOT also be wrapped in KeyboardAvoidingView — doing both causes the two
  // resize mechanisms to race each other and produces a visible ghosting
  // flicker on real devices when the keyboard height changes (e.g. as the
  // predictive-text bar appears/disappears while typing).
  const content = (
    <>
      <StatusBar
        barStyle={theme !== 'dark' ? 'dark-content' : 'light-content'}
      />
      <View style={{ flex: 1 }}>
        {enableAppBar && (
          <NavBar
            profilePicUpdate={() => setOptionsModal?.(true)}
            photo={photo}
          />
        )}
        {scrollable ? (
          <ScrollView
            paddingTop={enableAppBar ? 0 : 16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            refreshControl={refreshControl}
            // onScrollBeginDrag={Keyboard.dismiss}
            scrollEventThrottle={16}
            bounces={true}
            alwaysBounceVertical={false}
            nestedScrollEnabled
            removeClippedSubviews={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </View>

      {isVisible && title ? (
        <SimpleSheet isVisible={isVisible} onClose={handleCloseSheet}>
          {type === 'select' && (
            <SelectSheetContent
              data={data as SelectDataProps[]}
              title={title}
            />
          )}
          {type === 'searchTransaction' && <TransactionHistorySheet />}
          {type === 'beneficiary' && (
            <BeneficiarySheetContent
              data={
                data as {
                  options: SelectDataProps[];
                  type: 'bill' | 'transfer';
                  onPress?: (value: string | number) => void;
                }
              }
              title={title}
            />
          )}
        </SimpleSheet>
      ) : null}
    </>
  );

  return (
    <SafeAreaView style={[styles.container(colors.background), style]}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior="padding"
          keyboardVerticalOffset={headerOffset}
          enabled
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.keyboardAvoidingView}>{content}</View>
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: (backgroundColor: string) => ({
    flexGrow: 1,
    backgroundColor,
  }),
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
};

export default PageContainer;
