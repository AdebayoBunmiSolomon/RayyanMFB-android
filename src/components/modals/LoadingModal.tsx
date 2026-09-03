import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/metrics';
import FastImage from 'react-native-fast-image';

interface LoadingModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
}

const LoadingModal = ({ isVisible }: LoadingModalProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    isVisible && setShow(isVisible);
    setTimeout(() => {
      setShow(false);
    }, 2500);
  }, [isVisible]);

  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={styles.bottomModal}
      isVisible={show}
    >
      <View style={styles.modal}>
        <FastImage
          source={require('../../assets/gif/loader2.gif')}
          style={{ width: 270, height: 270 }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  // Modal

  bottomModal: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  modal: {
    width: horizontalScale(60),
    height: verticalScale(60),
    // backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(10),
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
