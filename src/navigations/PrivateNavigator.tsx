import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabsNavigator from '../navigations/TabsNavigator';
import { MainStackParamList } from '../types/navigation.types';
import TransactionOTP from '../screens/private/transfer/TransactionOTP';
import Transfer from '../screens/private/transfer/Transfer';
import OtherBanks from '../screens/private/transfer/OtherBanks';
import Reviews from '../screens/private/transfer/Review';
import TransferReceipt from '../screens/private/transfer/TransferReceipt';
import Beneficiaries from '../screens/private/beneficiary/Beneficiaries';
import AddBeneficiary from '../screens/private/beneficiary/AddBeneficiary';
import EditBeneficiary from '../screens/private/beneficiary/EditBeneficiary';
import ReviewsRayyan from '../screens/private/transfer/ReviewsRayyan';
import ReviewsOwnAccount from '../screens/private/transfer/ReviewsOwnAccount';
import ChangePassword from '../screens/private/settings/ChangePassword';
import SecurityQuestions from '../screens/private/settings/SecurityQuestions';
import MaintainPin from '../screens/private/settings/MaintainPin';
import TransactionPinOTP from '../screens/private/settings/TransactionPinOTP';
import TransactionLimit from '../screens/private/settings/TransactionLimit';
import TransactionHistory from '../screens/private/account/TransactionHistory';
import GenerateStatement from '../screens/private/account/GenerateStatement';
import TransactionReceipt from '../screens/private/TransactionReceipt';
import AccountSummary from '../screens/private/account/AccountSummary';
import RayyanReceipt from '../screens/private/transfer/RayyanReceipt';
import AirtimeData from '../screens/private/bills-payment/AirtimeData';
import BillsPage from '../screens/private/bills-payment/BillsPage';
import BillsReview from '../screens/private/bills-payment/BillsReview';
import AddBillBeneficiary from '../screens/private/bills-payment/AddBillBeneficiary';
import BillReceipt from '../screens/private/bills-payment/BillReceipt';
import BillsHistory from '../screens/private/bills-payment/BillsHistory';
import AccountOfficer from '../screens/private/account/AccountOfficer';
import TransferTypes from '../screens/private/transfer/TransferTypes';
import FaqScreen from '../screens/private/support/faq.screen';
import MenuScreen from '../screens/private/menu.screen';
import AccountInsight from '../screens/private/account/AccountInsight';
import ThemeScreen from '../screens/private/settings/theme.screen';
import AdvertScreen from '../screens/private/Advert';
import NewServiceRequest from '../screens/private/account/NewServiceRequest';
import RequestForm from '../screens/private/account/RequestForm';
import ServiceRequest from '../screens/private/account/ServiceRequest';
import AccountUpgradeIdentity from '../screens/private/settings/AccountUpgradeIdentity';
import AccountUpgradeSignature from '../screens/private/settings/AccountUpgradeSignature';
import AccountUpgradeProofAddress from '../screens/private/settings/AccountUpgradeProofAddress';
import AccountUpgrade from '../screens/private/account/AccountUpgrade';
import AccountUpgradeRequest from '../screens/private/settings/AccountUpgradeRequest';
import AccountLimit from '../screens/private/settings/AccountLimit';
import AccountAllLimit from '../screens/private/settings/AccountAllLimit';
import AccountUpgradeRequirements from '../screens/private/settings/AccountUpgradeRequirements';
import KycRequestStatus from '../screens/private/settings/KycRequestStatus';
import ShortcutScreen from '../screens/private/settings/shortcut.screen';
import BulkTransferStatus from '../screens/private/transfer/BulkTransferStatus';
import BatchRequests from '../screens/private/transfer/BatchRequests';
import BulkDetails from '../screens/private/transfer/BulkDetails';
import BulkTransfer from '../screens/private/transfer/Bulk';
import BulkMultiTransfer from '../screens/private/transfer/BulkMultiTransfer';
import TransferSummary from '../screens/private/transfer/TransferSummary';
import BillBeneficiaries from '../screens/private/bills-payment/BillBeneficiaries';
import SetTransactionLimit from '../screens/private/settings/SetTransactionLimit';
import UpgradeTransactionLimit from '../screens/private/settings/UpgradeTransactionLimit';
import StandingOrderScreen from '../screens/private/transfer/StandingOrderScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const PrivateNavigator: FC<{}> = () => {
  return (
    <Stack.Navigator
      screenOptions={{ animation: 'ios_from_right', headerShown: false }}
    >
      <Stack.Screen name="Advert" component={AdvertScreen} />

      <Stack.Screen name="Tabs" component={TabsNavigator} />

      <Stack.Screen name="Transfer" component={Transfer} />

      <Stack.Screen name="TransactionOTP" component={TransactionOTP} />

      <Stack.Screen name="NewServiceRequest" component={NewServiceRequest} />

      <Stack.Screen name="ServiceRequest" component={ServiceRequest} />

      <Stack.Screen name="KycRequestStatus" component={KycRequestStatus} />

      <Stack.Screen name="RequestForm" component={RequestForm} />

      <Stack.Screen name="AccountInsight" component={AccountInsight} />

      <Stack.Screen name="AccountUpgrade" component={AccountUpgrade} />

      <Stack.Screen
        name="AccountUpgradeRequirements"
        component={AccountUpgradeRequirements}
      />

      <Stack.Screen name="OtherBanks" component={OtherBanks} />

      <Stack.Screen name="BulkTransferStatus" component={BulkTransferStatus} />

      <Stack.Screen name="BatchRequests" component={BatchRequests} />

      <Stack.Screen name="BulkDetails" component={BulkDetails} />

      <Stack.Screen name="BulkTransfer" component={BulkTransfer} />

      <Stack.Screen name="BulkMultiTransfer" component={BulkMultiTransfer} />

      <Stack.Screen name="TransferSummary" component={TransferSummary} />

      <Stack.Screen name="Reviews" component={Reviews} />

      <Stack.Screen name="TransferReceipt" component={TransferReceipt} />

      <Stack.Screen name="Beneficiaries" component={Beneficiaries} />

      <Stack.Screen name="BillBeneficiaries" component={BillBeneficiaries} />

      <Stack.Screen name="AddBeneficiary" component={AddBeneficiary} />

      <Stack.Screen name="EditBeneficiary" component={EditBeneficiary} />

      <Stack.Screen name="ReviewsRayyan" component={ReviewsRayyan} />

      <Stack.Screen name="ReviewsOwnAccount" component={ReviewsOwnAccount} />

      <Stack.Screen name="ChangePassword" component={ChangePassword} />

      <Stack.Screen
        name="AccountUpgradeRequest"
        component={AccountUpgradeRequest}
      />

      <Stack.Screen
        name="AccountUpgradeIdentity"
        component={AccountUpgradeIdentity}
      />

      <Stack.Screen
        name="AccountUpgradeSignature"
        component={AccountUpgradeSignature}
      />

      <Stack.Screen
        name="AccountUpgradeProofAddress"
        component={AccountUpgradeProofAddress}
      />

      <Stack.Screen name="SecurityQuestions" component={SecurityQuestions} />

      <Stack.Screen name="MaintainPin" component={MaintainPin} />

      <Stack.Screen name="TransactionPinOTP" component={TransactionPinOTP} />

      <Stack.Screen name="TransactionLimit" component={TransactionLimit} />

      <Stack.Screen
        name="SetTransactionLimit"
        component={SetTransactionLimit}
      />

      <Stack.Screen
        name="UpgradeTransactionLimit"
        component={UpgradeTransactionLimit}
      />

      <Stack.Screen name="AccountLimit" component={AccountLimit} />

      <Stack.Screen name="AccountAllLimit" component={AccountAllLimit} />

      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />

      <Stack.Screen name="GenerateStatement" component={GenerateStatement} />

      <Stack.Screen name="TransactionReceipt" component={TransactionReceipt} />

      <Stack.Screen name="AccountSummary" component={AccountSummary} />

      <Stack.Screen name="RayyanReceipt" component={RayyanReceipt} />

      <Stack.Screen name="AirtimeData" component={AirtimeData} />

      <Stack.Screen name="BillsPage" component={BillsPage} />

      <Stack.Screen name="BillsReview" component={BillsReview} />

      <Stack.Screen name="AddBillBeneficiary" component={AddBillBeneficiary} />

      <Stack.Screen name="BillReceipt" component={BillReceipt} />

      <Stack.Screen name="BillsHistory" component={BillsHistory} />

      <Stack.Screen name="AccountOfficer" component={AccountOfficer} />

      {/* TRANSFER */}
      <Stack.Screen name="TransferTypes" component={TransferTypes} />
      {/* support */}
      <Stack.Screen name="Faq" component={FaqScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
      <Stack.Screen name="Shortcut" component={ShortcutScreen} />
      <Stack.Screen
        name="StandingOrderScreen"
        component={StandingOrderScreen}
      />
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
