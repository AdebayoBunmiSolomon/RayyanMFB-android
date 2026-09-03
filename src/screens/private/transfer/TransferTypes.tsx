import React from 'react';
import { View } from 'tamagui';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import TransferMethods from '../../../components/TransferMethods';

const TransferTypes = ({ route }) => {
  const { account } = route.params;

  return (
    <PageContainer>
      <HeaderAuth noLogo />
      <HeadingAuth
        title="Transfer Funds"
        subtitle="Choose a method to send money to your family and friends."
        swap
        marginTop={50}
        small
      />
      <View marginTop={24}>
        <TransferMethods account={account} />
      </View>
    </PageContainer>
  );
};

export default TransferTypes;
