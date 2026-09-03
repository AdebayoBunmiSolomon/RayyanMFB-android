import { FC } from 'react';
import TransferSuccessModal from './TransferSuccessModal';
import { IntraBankResponse } from '../../types/transfer.types';
import React from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onReceipt: (data: IntraBankResponse) => void;
  onAddBeneficiary: () => void;
  data: IntraBankResponse;
}

const SuccessModalWrapper: FC<Props> = ({
  visible,
  onClose,
  onReceipt,
  onAddBeneficiary,
  data,
}) => {
  return (
    <TransferSuccessModal
      message="Transaction Successful"
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      closeModal={onClose}
      onViewReceipt={() => onReceipt(data)}
      onAddBeneficiary={onAddBeneficiary}
    />
  );
};

export default SuccessModalWrapper;
