/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import moment from 'moment';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { useAppSelector } from '../../../hooks/hook';
import bulkDetailStyles from '../../../styles/bulkDetails';
import HeaderAuth from '../../../components/HeaderAuth';
import { useApi } from '../../../hooks/useApi';
import LoadingModal from '../../../components/modals/LoadingModal';
import { BulkTransferRequest } from '../../../types/transfer.types';
import { formatToNaira } from '../../../util/format';
import { ActivityIndicator, FlatList } from 'react-native';
import Input from '../../../components/Input';
import { useTheme } from '../../../context/ThemeContext';

const BulkTransferStatus: FC<MainStackScreenProps<'BulkTransferStatus'>> = ({
  route,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  const [loading, setLoading] = useState(true);
  const [bulkRequests, setBulkRequests] = useState<BulkTransferRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { batchId } = route.params ?? {};

  const { colors } = useTheme();

  const { requestInit } = useApi({ endpoint: 'bulkRequests' });

  const { styles } = bulkDetailStyles(currentTheme as any);

  useEffect(() => {
    const fetchBulkRequests = async () => {
      setLoading(true);
      try {
        const response = await requestInit(
          undefined,
          `/v1/corp/transfer/batch/${batchId}`,
        );
        setBulkRequests(response?.data?.data?.transfers);
      } catch (error) {
        console.error('Error fetching bulk requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBulkRequests();
  }, [batchId]);

  // Filter requests based on search input
  const filteredRequests = bulkRequests?.filter(request =>
    [
      request.accountNameEnquiry,
      request.beneficiaryAccountNumber,
      request.status,
    ].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Render each item
  const renderItem = ({ item }: { item: BulkTransferRequest }) => {
    return (
      <XStack
        flex={1}
        justifyContent="space-between"
        key={item.DT_RowId}
        style={styles.summary}
      >
        <YStack flex={1} gap={5}>
          <Text style={styles.name}>Initiated By</Text>
          <Text style={styles.name}>Initiated Date</Text>
          <Text style={styles.name}>Beneficiary Name</Text>
          <Text style={styles.name}>Beneficiary Account</Text>
          <Text style={styles.name}>Amount</Text>
          <Text style={styles.name}>Status</Text>
        </YStack>
        <YStack flex={1} gap={5}>
          <Text style={{ ...styles.name, fontWeight: '400' }} numberOfLines={1}>
            {item.initiatedBy}
          </Text>
          <Text style={{ ...styles.name, fontWeight: '400' }}>
            {moment(item.tranDate).format('LL')}
          </Text>
          <Text style={{ ...styles.name, fontWeight: '400' }} numberOfLines={1}>
            {item?.accountNameEnquiry}
          </Text>
          <Text
            style={{ ...styles.name, color: colors.cyan }}
            numberOfLines={1}
          >
            {item?.accountNumber} - {item.beneficiaryBank}
          </Text>
          <Text style={{ ...styles.name, fontWeight: '400' }}>
            {formatToNaira(item.amount)}
          </Text>
          <Text
            style={{
              ...styles.name,
              color: item?.status?.toLocaleLowerCase()?.includes('error')
                ? colors.error
                : colors.lightPrimary,
            }}
          >
            {item?.status === '00'
              ? 'Transaction Successful'
              : 'Transaction Failed'}
          </Text>
        </YStack>
      </XStack>
    );
  };

  return (
    <PageContainer>
      {/* Global Loading Modal */}
      {loading && (
        <LoadingModal
          isVisible={loading}
          onBackdropPress={() => setLoading(true)}
          onBackButtonPress={() => setLoading(true)}
        />
      )}

      <HeaderAuth headerTitle="Bulk Transfer Inquiry" noLogo />
      <View flex={1}>
        {/* Search Bar */}
        <Input
          placeholder="Search by name, account number, or status"
          value={searchQuery}
          onChangeText={setSearchQuery}
          marginTop={32}
        />

        {/* List of Transfers */}
        {loading ? (
          // Show loader while data is being fetched
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
              <Text
                style={{
                  textAlign: 'center',
                  padding: 20,
                  color: colors.grey04,
                }}
              >
                No transfers found
              </Text>
            }
            initialNumToRender={10} // Optimize rendering performance
            maxToRenderPerBatch={10}
            removeClippedSubviews={true} // Improve performance
          />
        )}
      </View>
    </PageContainer>
  );
};

export default BulkTransferStatus;
