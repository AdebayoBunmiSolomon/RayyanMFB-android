/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { ActivityIndicator, FlatList } from 'react-native';
import { useAppSelector } from '../../../hooks/hook';
import bulkDetailStyles from '../../../styles/bulkDetails';
import Switch from '../../../components/Switch';
import { Text, View, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import { BulkTransferRequest } from '../../../types/transfer.types';
import { useApi } from '../../../hooks/useApi';
import Input from '../../../components/Input';
import { useTheme } from '../../../context/ThemeContext';
import truncate from '../../../util/truncate';
import Button from '../../../components/Button';
import SuccessModal from '../../../components/modals/SuccessModal';
import BulkTransferSummary from '../../../components/BulkTransferSummary';
import { formatToNaira } from '../../../util/format';

const BulkDetails: FC<MainStackScreenProps<'BulkDetails'>> = ({
  navigation,
  route,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  const [loading, setLoading] = useState(true);
  const [bulkRequests, setBulkRequests] = useState<BulkTransferRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionIds, setTransactionIds] = useState<string>('');
  const [successModal, setSuccessModal] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [transCount, setTransCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // check total transfers len
  useEffect(() => {
    const checkedTransCount = Object.values(checkedItems).filter(
      value => value === true,
    ).length;
    setTransCount(checkedTransCount);
  }, [checkedItems]);

  // check total transfers amount
  useEffect(() => {
    const totalTransAmount = bulkRequests
      .filter(txn => checkedItems[txn.DT_RowId] === true) // Only include those with true values
      .reduce((sum, txn) => sum + txn.amount, 0);
    setTotalAmount(totalTransAmount);
  }, [checkedItems, bulkRequests]);

  const { batchId } = route.params;

  const { requestInit } = useApi({ endpoint: 'bulkRequests' });
  const updateTransferStatus = useApi({
    endpoint: 'approveTransfer',
  });

  const { colors } = useTheme();

  useEffect(() => {
    const fetchBulkRequests = async () => {
      setLoading(true);
      try {
        const response = await requestInit(
          undefined,
          `/v1/corp/transfer/batch/${batchId}`,
        );
        const data = response?.data?.data?.transfers;
        setBulkRequests(data);
        setCheckedItems(
          Object.fromEntries(
            data.map((item: { DT_RowId: any }) => [item.DT_RowId, false]),
          ),
        );
      } catch (error) {
        console.error('Error fetching bulk requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBulkRequests();
  }, [batchId]);

  // Toggle function
  const handleToggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const updatedChecks = { ...prev, [id]: !prev[id] };
      const checkedIds = Object.keys(updatedChecks).filter(
        key => updatedChecks[key],
      );
      setTransactionIds(checkedIds.join(',')); // Update transactionIds
      return updatedChecks;
    });
  };

  // Check all function
  const handleCheckAll = () => {
    const updatedChecks = Object.fromEntries(
      bulkRequests.map(item => [item.DT_RowId, true]),
    );
    setCheckedItems(updatedChecks);
    setTransactionIds(bulkRequests.map(item => item.DT_RowId).join(','));
  };

  // Uncheck all function
  const handleUncheckAll = () => {
    setCheckedItems(
      Object.fromEntries(bulkRequests.map(item => [item.DT_RowId, false])),
    );
    setTransactionIds('');
  };

  const filteredRequests = bulkRequests.filter(request =>
    [
      request.accountNameEnquiry,
      request.beneficiaryAccountNumber,
      request.status,
    ].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const { styles } = bulkDetailStyles(currentTheme as any);

  const handleSubmit = async () => {
    const response = await updateTransferStatus?.requestInit({
      transactionIds,
    });
    if (response?.data?.code === '00') {
      setTransactionIds('');
      setSuccessModal(true);
    }
  };

  const renderItem = ({
    item: {
      DT_RowId,
      accountNumber,
      narration,
      amount,
      status,
      beneficiaryBank,
      accountNameEnquiry,
    },
  }: {
    item: BulkTransferRequest;
  }) => {
    return (
      <XStack gap={20} key={DT_RowId} style={styles.summary}>
        <YStack gap={4}>
          <Text color={colors.grey04} style={styles.name}>
            {accountNameEnquiry}
          </Text>
          <Text style={styles.account} color={colors.lightPrimary}>
            {beneficiaryBank} - {accountNumber}
          </Text>
          <Text style={{ ...styles.narration, marginTop: 'auto' }}>
            {truncate(narration, 40)}
          </Text>
          <Text style={{ ...styles.narration, marginTop: 4 }}>Status</Text>
        </YStack>
        <YStack gap={4} flex={1} justifyContent="flex-end">
          <YStack
            style={styles.actions}
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Switch
              value={checkedItems[DT_RowId]}
              onValueChange={() => handleToggleCheck(String(DT_RowId))}
            />
            <Text
              style={{
                ...styles.narration,
                marginTop: 4,
                textAlign: 'right',
              }}
            >
              {checkedItems[DT_RowId] ? 'Accept' : 'Reject'}
            </Text>
          </YStack>
          <Text style={styles.amount}>{formatToNaira(amount)}</Text>
          <Text
            marginLeft="auto"
            textAlign="right"
            style={{
              ...styles.name,
              color: status?.toLocaleLowerCase()?.includes('error')
                ? colors.error
                : colors.lightPrimary,
            }}
          >
            {status === '00' ? 'Transaction Successful' : 'Transaction Failed'}
          </Text>
        </YStack>
      </XStack>
    );
  };

  return (
    <PageContainer>
      {successModal && (
        <SuccessModal
          title="Selected transactions updated successfully!"
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(false)}
          onBackButtonPress={() => setSuccessModal(false)}
          onSwipeComplete={() => setSuccessModal(false)}
          closeModal={() => setSuccessModal(false)}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        />
      )}

      <HeaderAuth headerTitle="Batch Details" noLogo />
      <View flex={1}>
        <Input
          placeholder="Search by name, account number, or status"
          value={searchQuery}
          onChangeText={setSearchQuery}
          marginTop={32}
        />
        {/* divider */}
        <View marginTop={32} />
        <BulkTransferSummary
          title="Selected Transfers Summary"
          entries={transCount}
          totalAmount={totalAmount}
        />

        <XStack
          marginTop={28}
          marginBottom={8}
          gap={10}
          justifyContent="flex-end"
        >
          <Button
            disabled={!transactionIds.length}
            fontSize={12}
            flex={1}
            height={40}
            loading={updateTransferStatus?.loading}
            onPress={handleSubmit}
          >
            Submit Request
          </Button>
          <Button
            fontSize={12}
            height={40}
            variant="outlined"
            onPress={handleCheckAll}
          >
            Check All
          </Button>
          <Button
            fontSize={12}
            height={40}
            variant="outlined"
            onPress={handleUncheckAll}
          >
            Uncheck All
          </Button>
        </XStack>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={item => String(item.DT_RowId)}
            renderItem={renderItem}
            style={{ marginTop: 24 }}
            nestedScrollEnabled={true}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', padding: 20 }}>
                No transfers found
              </Text>
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default BulkDetails;
