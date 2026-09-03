import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { horizontalScale, global } from '../../../../theme/metrics';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import { CreateNewAccount } from '../../../../types/public.types';
import { useLazyGetTermsAndConditionsQuery } from '../../../../api/public';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../../components/Input';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useApi } from '../../../../hooks/useApi';
import { normalizeSize } from '../../../../util/size';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAppToast } from '../../../../hooks/useAppToast';
import Checkbox from '../../../../components/ui/Checkbox';

const usernameValidationSchema = yup.object().shape({
  userName: yup.string().required('Username is required'),
  password: yup
    .string()
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .matches(/\d/, 'Password must have a number')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must have a special character',
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
  acceptedTermsAndConditions: yup
    .boolean()
    .oneOf([true], 'Click the checkbox to accept terms and conditions'),
});

const Username: FC<PublicStackScreenProps<'Username'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const create = useApi({ endpoint: 'registerExistingAccount' });
  const [terms] = useLazyGetTermsAndConditionsQuery();
  const [pdf, setPdf] = useState('');
  const [suggestedName, setSuggestedName] = useState<null | string>(null);

  const { colors } = useTheme();
  const { showError } = useAppToast();

  const createNewUser = async (val: CreateNewAccount) => {
    setLoading(true);
    try {
      const res = await create.requestInit(val);
      const { code, error, data, message } = res?.data;
      if (error) {
        showError(message);
        return setSuggestedName(data);
      }
      if (code === '00') {
        navigation.navigate('Success', { item: res?.data });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserTerms = async () => {
      try {
        const res = await terms().unwrap();
        if (res.content) {
          setPdf(res.content);
        }
      } catch (error) {}
    };

    getUserTerms();
  }, [terms]);

  const styles = StyleSheet.create({
    readText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      fontWeight: '500',
      color: colors.grey05,
    },
    tabItem: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.input,
      borderRadius: normalizeSize(12),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      alignSelf: 'flex-start',
    },
    activeTab: {
      borderWidth: 1,
      borderColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      color: colors.grey05,
      textTransform: 'capitalize',
      fontFamily: 'Inter-Medium',
    },
  });

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="Set Up Your Mobile Banking"
        subtitle="Create a Username and Password"
      />
      {/* form */}
      <Formik
        validationSchema={usernameValidationSchema}
        initialValues={{
          userName: '',
          password: '',
          confirmPassword: '',
          acceptedTermsAndConditions: false,
        }}
        onSubmit={async values => {
          const payload = {
            confirmPassword: values.confirmPassword,
            acceptedTermsAndConditions: values.acceptedTermsAndConditions,
            customerCreationRequest: {
              bvn: item.bvn,
              customerImage: item.profilePicture.replace(
                /^data:image\/\w+;base64,/,
                '',
              ),

              dateOfBirth: item.dateOfBirth,
              gender: item.gender,
              nationalIdentityNo: '',
              customerSignature: '',
              identificationImage: '',
              lastName: item?.lastName,
              address: item.address,
              // otherNames: `${item?.firstName} ${item?.middleName}`,
              otherNames: `${item?.firstName || ''} ${item?.middleName || ''}`,
              phoneNo: item.phone,
              email: item.email,
            },
            password: values.password,
            secAns: item.secAns,
            secQes: item.secQes,
            userName: values.userName?.trim(),
            // email: item.email,
          };
          await createNewUser(payload);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          dirty,
          isValid,
          touched,
          setFieldValue,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <Input
                label="Username"
                placeholder="Username"
                onChangeText={handleChange('userName')}
                onBlur={handleBlur('userName')}
                value={values.userName}
                error={touched.userName && errors.userName}
              />
              {suggestedName && (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <XStack marginTop={-10} gap={8} alignItems="center">
                    <Text color={colors.grey05} fontSize={15}>
                      Suggested:
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.tabItem,
                        values.userName === suggestedName && styles.activeTab,
                      ]}
                      onPress={() => setFieldValue('userName', suggestedName)}
                    >
                      <Text style={[styles.tabText]}>{suggestedName}</Text>
                    </TouchableOpacity>
                  </XStack>
                </Animated.View>
              )}
              <Input
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={isSecureEntry}
                error={touched.password && errors.password}
                endIcon={
                  <TouchableOpacity
                    onPress={() => setIsSecureEntry(prev => !prev)}
                  >
                    {isSecureEntry ? (
                      <EyeSlash size={23} color="#636666" />
                    ) : (
                      <Eye size={23} color="#636666" />
                    )}
                  </TouchableOpacity>
                }
                showRules
              />

              <Input
                label="Confirm Password"
                placeholder="Password"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry={isSecureEntry}
                error={touched.confirmPassword && errors.confirmPassword}
                endIcon={
                  <TouchableOpacity
                    onPress={() => setIsSecureEntry(prev => !prev)}
                  >
                    {isSecureEntry ? (
                      <EyeSlash size={23} color="#636666" />
                    ) : (
                      <Eye size={23} color="#636666" />
                    )}
                  </TouchableOpacity>
                }
                // showRules
              />
            </YStack>

            <View style={{ ...global.rowCenter, marginTop: 24 }}>
              <Checkbox
                label={
                  <XStack flex={1} marginLeft={8}>
                    <Text style={styles.readText}>I have read</Text>
                    <TouchableOpacity
                      style={{ marginLeft: horizontalScale(3) }}
                      onPress={async () => {
                        navigation.navigate('PDF', { item: pdf });
                      }}
                    >
                      <Text
                        style={{
                          ...styles.readText,
                          color: colors.primary,
                          fontWeight: '600',
                        }}
                      >
                        Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  </XStack>
                }
                value={values?.acceptedTermsAndConditions}
                setValue={newValue =>
                  setFieldValue('acceptedTermsAndConditions', newValue)
                }
              />
              {/* <CheckBox
                tintColors={{ true: colors.appPrimary }}
                onCheckColor={colors.appPrimary}
                onTintColor={colors.appPrimary}
                onFillColor={colors.white}
                style={{
                  width: horizontalScale(15),
                  height: verticalScale(15),
                }}
                disabled={false}
                value={values?.acceptedTermsAndConditions}
                boxType="square"
                onValueChange={newValue =>
                  setFieldValue('acceptedTermsAndConditions', newValue)
                }
              />

              <View
                style={{
                  ...global.rowCenter,
                  marginLeft: horizontalScale(10),
                }}
              >
                <Text style={styles.readText}>I have read</Text>
                <TouchableOpacity
                  style={{ marginLeft: horizontalScale(3) }}
                  onPress={async () => {
                    navigation.navigate('PDF', { item: pdf });
                  }}
                >
                  <Text
                    style={{
                      ...styles.readText,
                      color: colors.primary,
                      fontWeight: '600',
                    }}
                  >
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>

            <View marginTop={'auto'} marginBottom={16}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                loading={loading}
              >
                Sign Up
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default Username;
