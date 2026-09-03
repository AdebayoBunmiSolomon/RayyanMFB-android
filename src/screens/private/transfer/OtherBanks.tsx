// screens/OtherBanks.tsx
import React from 'react';
import { View } from 'tamagui';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useOtherBankLogic } from '../../../hooks/transfer/useOtherBankLogic';
import OtherBankForm from '../../../components/form/OtherBankForm';
import { MainStackScreenProps } from '../../../types/navigation.types';

const OtherBanks: React.FC<MainStackScreenProps<'OtherBanks'>> = ({
  onPress,
  account,
  transDetails,
}: any) => {
  const {
    modal,
    contacts,
    userAccounts,
    bankList,
    selectedBankObj,
    accountName,
    inputText,
    setInputText,
    formikRef,
    onPress: handleSubmit,
    interUsedLeft,
    updateBankInfo,
    handleItemPress,
    selectedBeneficiariesHash,
    getAccBalance,
    loading,
  } = useOtherBankLogic({
    onPress,
    account,
    transDetails,
  });

  return (
    <View flex={1}>
      <LoadingModal
        isVisible={modal}
        onBackdropPress={() => setInputText(inputText)}
        onBackButtonPress={() => setInputText(inputText)}
      />
      <OtherBankForm
        loading={loading}
        contacts={contacts}
        userAccounts={userAccounts}
        bankList={bankList}
        selectedBankObj={selectedBankObj}
        accountName={accountName}
        inputText={inputText}
        setInputText={setInputText}
        formikRef={formikRef}
        onPress={handleSubmit}
        interUsedLeft={interUsedLeft}
        updateBankInfo={updateBankInfo}
        handleItemPress={handleItemPress}
        selectedBeneficiariesHash={selectedBeneficiariesHash}
        getAccBalance={getAccBalance}
      />
    </View>
  );
};

export default OtherBanks;
