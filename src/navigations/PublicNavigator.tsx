import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PublicStackParamList } from '../types/navigation.types';
import Splash from '../screens/public/Splash';
import AccountInformation from '../screens/public/device/AccountInformation';
import DeviceSuccess from '../screens/public/device/DeviceSuccess';
import SecurityQA from '../screens/public/device/SecurityQA';
import AcctInfo from '../screens/public/forgotpassword/AcctInfo';
import NewPassword from '../screens/public/forgotpassword/NewPassword';
import PasswordSuccess from '../screens/public/forgotpassword/PasswordSuccess';
import SecQuestion from '../screens/public/forgotpassword/SecQuestion';
import ForgotPasswordOTP from '../screens/public/forgotpassword/ForgotPasswordOTP';
import DeviceOTP from '../screens/public/device/DeviceOTP';
import AccountInfo from '../screens/public/signup/exisiting_account/AccountInfo';
import CardNumber from '../screens/public/signup/exisiting_account/CardNumber';
import CreateUsername from '../screens/public/signup/exisiting_account/CreateUsername';
import OTPVerification from '../screens/public/signup/exisiting_account/OTPVerification';
import RegisterSuccess from '../screens/public/signup/exisiting_account/RegisterSuccess';
import SecurityQuestion from '../screens/public/signup/exisiting_account/SecurityQuestion';
import Bvn from '../screens/public/signup/new_account/Bvn';
import Identification from '../screens/public/signup/new_account/Identification';
import Kyc from '../screens/public/signup/new_account/Kyc';
import Signature from '../screens/public/signup/new_account/Signature';
import Success from '../screens/public/signup/new_account/Success';
import Username from '../screens/public/signup/new_account/Username';
import Login from '../screens/public/Login';
import QuestionPage from '../screens/public/QuestionPage';
import Question from '../screens/public/signup/new_account/Question';
import { useAppSelector } from '../hooks/hook';
import PDF from '../screens/public/Pdf';
import Contact from '../screens/public/Contact';
import Support from '../screens/tabs/Support';
import AccountCorpInfo from '../screens/public/device/AccountCorpInfo';
import SecurityQACorp from '../screens/public/device/SecurityQACorp';
import ConfirmUserAccount from '../screens/public/forgotpassword/corporate/ConfirmUserAccount';
import ForgotPasswordSecurityQA from '../screens/public/forgotpassword/corporate/SecurityQA';
import NewTokenPassword from '../screens/public/forgotpassword/corporate/NewTokenPassword';
import { SecQuestionReset } from '../screens/public/SecQuestionReset';
import { SecQuestionResetOTP } from '../screens/public/SecQuestionResetOTP';

const Stack = createNativeStackNavigator<PublicStackParamList>();

const PublicNavigator: FC<{}> = () => {
  const { showSplash } = useAppSelector(state => state.auth);
  return (
    <Stack.Navigator
      initialRouteName={showSplash ? 'Splash' : 'Login'}
      screenOptions={{ animation: 'ios_from_right' }}
    >
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="AccountInformation"
        component={AccountInformation}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="AccountCorpInfo"
        component={AccountCorpInfo}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="SecurityQACorp"
        component={SecurityQACorp}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="DeviceSuccess"
        component={DeviceSuccess}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="SecurityQA"
        component={SecurityQA}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="DeviceOTP"
        component={DeviceOTP}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="AcctInfo"
        component={AcctInfo}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="ConfirmUserAccount"
        component={ConfirmUserAccount}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="ForgotPasswordSecurityQA"
        component={ForgotPasswordSecurityQA}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="NewTokenPassword"
        component={NewTokenPassword}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="PasswordSuccess"
        component={PasswordSuccess}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="SecQuestion"
        component={SecQuestion}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="ForgotPasswordOTP"
        component={ForgotPasswordOTP}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="CardNumber"
        component={CardNumber}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="CreateUsername"
        component={CreateUsername}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="OTPVerification"
        component={OTPVerification}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="RegisterSuccess"
        component={RegisterSuccess}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="SecurityQuestion"
        component={SecurityQuestion}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Bvn"
        component={Bvn}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Identification"
        component={Identification}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Kyc"
        component={Kyc}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Signature"
        component={Signature}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Success"
        component={Success}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Username"
        component={Username}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="QuestionPage"
        component={QuestionPage}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Question"
        component={Question}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="PDF"
        component={PDF}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="SecurityQuestionReset"
        component={SecQuestionReset}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="SecQuestionResetOTP"
        component={SecQuestionResetOTP}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default PublicNavigator;
