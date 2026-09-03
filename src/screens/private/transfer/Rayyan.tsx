// screens/Rayyan.tsx
import React from 'react';
import { View } from 'tamagui';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useRayyanLogic } from '../../../hooks/transfer/useRayyanLogic';
import RayyanForm from '../../../components/form/RayyanForm';
import { MainStackScreenProps } from '../../../types/navigation.types';

const Rayyan: React.FC<MainStackScreenProps<'Rayyan'>> = ({
  onPress,
  account,
}: any) => {
  const {
    selectedBeneficiariesHash,
    setSelectedBeneficiariesHash,
    loadingModal,
    setLoadingModal,
    inputText,
    setInputText,
    userAccounts,
    contacts,
    intraUsedLeft,
    accounts,
    formikRef,
    getInterBankUsedLeft,
    handleOnChange,
    handleItemPress,
    onPress: handleSubmit,
  } = useRayyanLogic({
    onPress,
    account,
  });

  return (
    <View flex={1}>
      <LoadingModal
        isVisible={loadingModal}
        onBackdropPress={() => setLoadingModal(true)}
        onBackButtonPress={() => setLoadingModal(true)}
      />
      <RayyanForm
        selectedBeneficiariesHash={selectedBeneficiariesHash}
        setSelectedBeneficiariesHash={setSelectedBeneficiariesHash}
        inputText={inputText}
        setInputText={setInputText}
        userAccounts={userAccounts}
        contacts={contacts}
        intraUsedLeft={intraUsedLeft}
        loadingModal={loadingModal}
        getInterBankUsedLeft={getInterBankUsedLeft}
        handleOnChange={handleOnChange}
        handleItemPress={handleItemPress}
        onPress={handleSubmit}
        account={account}
        accounts={accounts}
        formikRef={formikRef}
      />
    </View>
  );
};

export default Rayyan;
