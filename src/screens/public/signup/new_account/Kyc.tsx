import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Moment from 'moment';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import gender__ from '../../../../mock/Gender';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import PageContainer from '../../../../components/PageContainer';
import { Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../../components/Input';
import { useTheme } from '../../../../context/ThemeContext';
// import CustomDateSelect from '../../../../components/CustomDateSelect';

interface Props {
  key: number;
  label: string;
  value: string;
}
const kycValidationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  // dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Select gender'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is required'),
  address: yup.string().required('Address is required'),
  phone: yup
    .string()
    .matches(/(0)(\d){10}\b/, 'Enter a valid phone number')
    .required('Phone number is required'),
});

const Kyc: FC<PublicStackScreenProps<'Kyc'>> = ({ navigation, route }) => {
  const { item } = route.params;

  const { colors } = useTheme();

  const [selectGender, setSelectedGender] = useState('');

  const [gender, setGender] = useState<Props[]>([]);

  const [details, _] = useState({
    firstName: item?.firstName,
    lastName: item?.lastName,
    middleName: item?.middleName,
    dateOfBirth: item?.dateOfBirth
      ? Moment(item?.dateOfBirth, 'DD-MMM-YY').format('YYYY-MM-DD')
      : Moment().subtract(18, 'years').endOf('year').format('YYYY-MM-DD'),
    phone: item?.phone,
    gender: '',
    email: item?.email,
    address: '',
  });

  const handleOnChange = (value: string | null) => {
    setSelectedGender(value as string);
  };

  useEffect(() => {
    const getGenders = async () => {
      const gender_ = gender__.map((_, index) => {
        return {
          key: index,
          value: _.value,
          label: _.label,
        };
      });
      setGender(gender_);
    };

    getGenders();
  }, []);

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth title="Create New Account" subtitle="Personal Information" />
      {/* form */}
      <Formik
        validationSchema={kycValidationSchema}
        initialValues={(details && details) || {}}
        enableReinitialize={true}
        onSubmit={async values => {
          navigation.navigate('Signature', {
            item: { ...values, bvn: item?.bvn },
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          dirty,
          isValid,
          touched,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={18}>
              <Input
                placeholder="First Name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                editable={false}
                label="First Name"
              />

              <Input
                label="Last Name"
                placeholder="Last Name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                editable={false}
              />

              <Input
                label="Other Name"
                placeholder="Other Name"
                onChangeText={handleChange('middleName')}
                value={values.middleName}
                editable={false}
              />

              <Select
                label="Gender"
                value={selectGender}
                onChange={value => {
                  handleOnChange(value as any);
                  setFieldValue('gender', value);
                }}
                data={gender}
                placeholder="Gender"
              />

              <Input
                label="Date of Birth"
                placeholder="Date of Birth"
                onChangeText={handleChange('middleName')}
                value={details?.dateOfBirth}
                editable={false}
              />

              <Input
                label="Phone Number"
                placeholder="Phone Number"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                maxLength={11}
                keyboardType={'number-pad'}
                editable={false}
              />

              <Input
                label="Address"
                placeholder="Address"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                error={touched.address && errors.address}
              />

              <Input
                label="Email address"
                placeholder="Email address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email as string}
                editable={item?.email ? false : true}
                error={touched.email && errors.email}
              />
            </YStack>

            {/* bottom elements */}
            <View marginTop={48} marginBottom={16}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
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
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default Kyc;
