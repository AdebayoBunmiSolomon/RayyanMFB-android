/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import moment from 'moment';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { useAppSelector } from '../../../hooks/hook';
import bulkDetailStyles from '../../../styles/bulkDetails';
import HeaderAuth from '../../../components/HeaderAuth';
import colors from '../../../theme/color';
import { useApi } from '../../../hooks/useApi';
import LoadingModal from '../../../components/modals/LoadingModal';
import { BulkTransferRequest } from '../../../types/transfer.types';
import { formatToNaira } from '../../../util/format';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import Input from '../../../components/Input';

const BatchRequests: FC<MainStackScreenProps<'BatchRequests'>> = ({
  route,
  navigation,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  const [loading, setLoading] = useState(true);
  const [bulkRequests, setBulkRequests] = useState<BulkTransferRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { nested } = route.params ?? {};

  const { requestInit } = useApi({ endpoint: 'bulkRequests' });

  const { styles } = bulkDetailStyles(currentTheme as any);

  useEffect(() => {
    const fetchBulkRequests = async () => {
      setLoading(true);
      try {
        const response = await requestInit();
        setBulkRequests(response?.data?.data?.content || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchBulkRequests();
  }, []);

  // Filter requests based on search input
  const filteredRequests = bulkRequests.filter(request =>
    [
      request.beneficiaryAccountName,
      request.beneficiaryAccountNumber,
      request.statusDescription,
    ].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Render each item
  const renderItem = ({ item }: { item: BulkTransferRequest }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(nested, {
          batchId: item?.batchId,
        })
      }
    >
      <XStack
        flex={1}
        justifyContent="space-between"
        key={item?.DT_RowId}
        style={styles.summary}
      >
        <YStack flex={1} gap={5}>
          <Text style={styles.name}>Batch ID</Text>
          <Text style={styles.name}>Initiated By</Text>
          <Text style={styles.name}>Created Date</Text>
          <Text style={styles.name}>Total Amount</Text>
          <Text style={styles.name}>Transfers Count</Text>
          <Text style={styles.name}>Status</Text>
        </YStack>
        <YStack flex={1} gap={5}>
          <Text style={{ ...styles.name, fontWeight: '400' }} numberOfLines={1}>
            BT{item?.batchId}
          </Text>
          <Text style={{ ...styles.name, fontWeight: '400' }} numberOfLines={1}>
            {item?.initiatedBy}
          </Text>
          <Text style={{ ...styles.name, fontWeight: '400' }}>
            {moment(item?.tranDate).format('LL')}
          </Text>
          <Text style={{ ...styles.name, fontWeight: '400' }}>
            {formatToNaira(item?.amount)}
          </Text>
          <Text style={{ ...styles.name, color: colors.cyan }}>
            {item?.noOfTransfer}
          </Text>
          <Text
            style={{
              ...styles.name,
              color: colors.lightPrimary,
            }}
          >
            Completed
          </Text>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );

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

      <HeaderAuth headerTitle="Bulk Transfers" noLogo />
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
              <Text style={{ textAlign: 'center', padding: 20 }}>
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

export default BatchRequests;
