/* eslint-disable react-native/no-inline-styles */
import { View, Text, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import accountSlideStyles from '../styles/accountSlide';
import { Copy, Eye, EyeSlash } from 'iconsax-react-native';
import IconButton from './IconButton';
import Balance from './Balance';
import Clipboard from '@react-native-clipboard/clipboard';
import AccountActions from './AccountActions';
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import { setShowBalance } from '../slices/appSlice';
import { AccountSlideTypes } from '../types/account.types';
import { useAppToast } from '../hooks/useAppToast';
import truncate from '../util/truncate';

const { styles } = accountSlideStyles();

const AccountSlide = ({
  accountType,
  status,
  currencyCode,
  acctBalance,
  accountName,
  accountNumber,
  noActions,
}: AccountSlideTypes) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(false);
  const { showBalance } = useAppSelector(state => state.app);

  const { showSuccess } = useAppToast();
  const dispatch = useAppDispatch();

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
    dispatch(setShowBalance(!isBalanceVisible));
  };

  const copyAccNumToClipboard = () => {
    showSuccess('Account number copied to clipboard');
    Clipboard.setString(accountNumber);
  };

  useEffect(() => {
    const fnShowBalance = async () => {
      setIsBalanceVisible(showBalance);
    };
    fnShowBalance();
  }, [showBalance]);

  return (
    <View style={{ ...styles.slideWrapper, height: noActions ? 168 : 275 }}>
      <ImageBackground
        source={require('../assets/img/card-background.png')}
        resizeMode="cover"
        style={styles.slide}
      >
        {/* account state */}
        <View style={styles.accountState}>
          {/* account type */}
          <Text
            style={{ ...styles.accountType, fontSize: noActions ? 12 : 14 }}
          >
            {accountType?.toUpperCase?.()}
          </Text>
          {/* status  */}
          <View style={styles.accountStatus}>
            <Text style={styles.statusName}>
              {status === 'A' ? 'Active' : 'Inactive'}
            </Text>
            <View
              style={{
                ...styles.statusColor,
                backgroundColor: status === 'A' ? '#56F000' : '#BFCDDB',
              }}
            />
          </View>
        </View>
        {/* account balance */}
        <View style={styles.accountBalance}>
          <Balance
            amount={String(acctBalance)}
            currency={currencyCode}
            visible={isBalanceVisible}
            onPress={toggleBalanceVisibility}
            small={noActions}
          />

          <IconButton onPress={toggleBalanceVisibility} style={{ top: 5 }}>
            {isBalanceVisible ? (
              <Eye size={noActions ? 20 : 22} color="#fff" />
            ) : (
              <EyeSlash size={noActions ? 20 : 22} color="#fff" />
            )}
          </IconButton>
        </View>
        {/* account name and number */}
        <View style={styles.accountDetails}>
          <Text
            style={{ ...styles.accountName, fontSize: noActions ? 12 : 14 }}
          >
            {truncate(accountName?.split(' ', 2).join(' '), 20)}
          </Text>
          <View style={styles.accountNumber}>
            <Text
              style={{ ...styles.accountName, fontSize: noActions ? 12 : 14 }}
            >
              {accountNumber}
            </Text>
            <Copy
              onPress={copyAccNumToClipboard}
              size={20}
              color={'#D2D8D8'}
              variant="Bulk"
            />
          </View>
        </View>
      </ImageBackground>
      {!noActions && <AccountActions />}
    </View>
  );
};

export default AccountSlide;
