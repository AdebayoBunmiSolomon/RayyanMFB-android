/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import { OtpVerification } from '../../../../types/public.types';
import { Text, View, XStack } from 'tamagui';
import PageContainer from '../../../../components/PageContainer';
import Button from '../../../../components/Button';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { useTheme } from '../../../../context/ThemeContext';
import { useApi } from '../../../../hooks/useApi';
import { useAppToast } from '../../../../hooks/useAppToast';

interface RendererProps {
  index: number;
  symbol: any;
  isFocused: boolean;
}

const CELL_COUNT = 4;

const OTPVerification: FC<PublicStackScreenProps<'OTPVerification'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  const verify = useApi({ endpoint: 'verifyAccountOtpRequest' });
  const { showSuccess } = useAppToast();
  // const mock = React.memo(() =>
  //   // !- remove
  //   navigation.navigate('SecurityQuestion', {
  //     item: {
  //       accountNumber: '1100002967',
  //       lastFourDigitsOfBVN: '2280',
  //       otp: '123456',
  //     },
  //   });

  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [_, setWait] = useState(false);
  const [value, setValue] = useState('');
  const [counter, setCounter] = useState(59);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
      setWait(true);
    } else {
      setWait(false);
    }
  });

  const styles = StyleSheet.create({
    codeFiledRoot: {
      marginTop: 32,
      justifyContent: 'flex-start',
    },
    cell: {
      width: 56,
      height: 56,
      lineHeight: 55,
      fontSize: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      color: colors.grey06,
      backgroundColor: colors.input,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    focusCell: {
      borderColor: colors.primary,
    },
  });

  const verifyOtp = async (val: OtpVerification) => {
    setLoading(true);
    return navigation.navigate('SecurityQuestion', { item: val });

    try {
      const res = await verify.requestInit(val);
      if (res) {
        setLoading(false);
        navigation.navigate('SecurityQuestion', { item: val });
        showSuccess('OTP verified successfully!');
      }
      setLoading(false);
      // mock();
    } catch (error) {
      setLoading(false);
    }
  };

  const renderCell = ({ index, symbol, isFocused }: RendererProps) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell(value, index)}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };
  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="OTP Verification"
        subtitle="Enter OTP sent to your mobile number"
      />
      {/* form */}
      <View>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />
      </View>

      {/* bottom elements */}
      <View marginTop="auto" marginBottom={8}>
        <Button
          onPress={async () => {
            const payload = { ...item, otp: value };
            verifyOtp(payload);
          }}
          disabled={value.length < 4}
          width={'100%'}
          loading={loading}
        >
          Continue
        </Button>

        {/* sign in */}
        <XStack marginInline="auto" marginTop={12} gap={4}>
          <Text color={colors.grey05} fontSize={14} fontWeight={'500'}>
            Already Activated
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Login')}
          >
            <Text color={colors.primary} fontWeight="500">
              Sign In
            </Text>
          </TouchableWithoutFeedback>
        </XStack>
      </View>
    </PageContainer>
  );
};

export default OTPVerification;
