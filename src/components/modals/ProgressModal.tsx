// import { StyleSheet, View } from 'react-native';
// import React from 'react';
// import Modal from 'react-native-modal';
// import {
//   colors,
//   global,
//   horizontalScale,
//   moderateScale,
//   verticalScale,
// } from '../../theme/metrics';
// // import LoaderKit from 'react-native-loader-kit';
// import FastImage from 'react-native-fast-image';

// interface ProgressModalProps {
//   isVisible: boolean;
//   onBackdropPress: () => void;
//   onBackButtonPress: () => void;
//   progressText?: string;
// }

// const ProgressModal = ({ isVisible }: ProgressModalProps) => {
//   return (
//     <Modal
//       avoidKeyboard
//       propagateSwipe={true}
//       style={styles.bottomModal}
//       isVisible={isVisible}
//     >
//       <View>
//         <View style={{ ...global.flexRow }}>
//           <FastImage
//             source={require('../../assets/gif/loader2.gif')}
//             style={{ width: 270, height: 270 }}
//             resizeMode={FastImage.resizeMode.contain}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default ProgressModal;

// const styles = StyleSheet.create({
//   // Modal

//   bottomModal: {
//     flex: 1,
//     justifyContent: 'center',
//     margin: 0,
//   },

//   modal: {
//     width: '100%',
//     height: verticalScale(191),
//     backgroundColor: colors.white,
//     paddingHorizontal: horizontalScale(10),
//   },

//   progressText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: moderateScale(20),
//     fontStyle: 'normal',
//     fontWeight: '600',
//     color: colors.semiLightTextColor,
//   },
// });

import { StyleSheet, View } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {
  colors,
  global,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/metrics';
import FastImage from 'react-native-fast-image';

interface ProgressModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  progressText?: string;
}

const ProgressModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
}: ProgressModalProps) => {
  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
      backdropOpacity={0.6}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View>
        <View style={{ ...global.flexRow }}>
          <FastImage
            source={require('../../assets/gif/loader2.gif')}
            style={{ width: 270, height: 270 }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProgressModal;

const styles = StyleSheet.create({
  bottomModal: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
  },

  modal: {
    width: '100%',
    height: verticalScale(191),
    backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(10),
  },

  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(20),
    fontStyle: 'normal',
    fontWeight: '600',
    color: colors.semiLightTextColor,
  },
});
