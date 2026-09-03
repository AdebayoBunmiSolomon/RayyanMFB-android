/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import ListCard from '../../../components/ListCard';
import { useApi } from '../../../hooks/useApi';
import { ServiceRequestTypes } from '../../../types';
import HeadingAuth from '../../../components/HeadingAuth';
import LoadingModal from '../../../components/modals/LoadingModal';
import { serviceRequests } from '../../../util/logoMap';
import CapitalizeLetter from '../../../util/capitalizeWords';

const NewServiceRequest = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [requestOptions, setRequestOptions] = useState<any[]>([]);

  const { requestInit } = useApi({ endpoint: 'listServiceOptions' });

  useEffect(() => {
    setLoading(true);
    try {
      const fetchRequestOptions = async () => {
        const response = await requestInit();
        const optionObj = response?.data?.map(
          ({ id, name, description }: ServiceRequestTypes) => ({
            id,
            title: CapitalizeLetter(name?.replaceAll('-', ' ')),
            subtitle: description,
            icon: serviceRequests[name],
          }),
        );
        setRequestOptions(optionObj);
        setLoading(false);
      };
      fetchRequestOptions();
    } catch (error) {
    } finally {
    }
  }, []);

  return (
    <PageContainer>
      <LoadingModal isVisible={loading} />

      <HeaderAuth noLogo />
      <HeadingAuth
        swap
        title="Service Request"
        subtitle="Select a Service Request Type"
      />

      {requestOptions?.length ? (
        <ListCard
          onItemPress={value =>
            navigation.navigate('RequestForm', {
              reqId: value,
              title: requestOptions?.find(({ id }) => id === value)?.title,
            })
          }
          marginTop={32}
          list={requestOptions}
        />
      ) : (
        ''
      )}
    </PageContainer>
  );
};

export default NewServiceRequest;
