// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { FC, useEffect, useRef, useState } from 'react';
// import { MainStackScreenProps } from '../../../types/navigation.types';
// import PageContainer from '../../../components/PageContainer';
// import { Formik, FormikProps, FormikValues } from 'formik';
// import * as yup from 'yup';
// import Button from '../../../components/Button';
// import SuccessModal from '../../../components/modals/SuccessModal';
// import LoadingModal from '../../../components/modals/LoadingModal';
// import ConfirmPinModal from '../../../components/modals/ConfirmPinModal';
// import { TnxPIN } from '../../../types/settings.types';
// import NewPinModal from '../../../components/modals/NewPinModal';
// import { SAVE_P } from '../../../services/storage';
// import { useApi } from '../../../hooks/useApi';
// import HeaderAuth from '../../../components/HeaderAuth';
// import { View, YStack } from 'tamagui';
// import Input from '../../../components/Input';
// import randomNumber from '../../../util/randomNumber';
// import { onlyTextRegex } from '../../../util/regex';
// import { useAppToast } from '../../../hooks/useAppToast';

// interface MaintainPinState {
//   modalVisible: boolean;
//   newPinModalVisible: boolean;
//   confirmPinModalVisible: boolean;
//   loading_: boolean;
//   newPinValue: string;
//   confirmPinValue: string;
// }

// const securityValidationSchema = yup.object().shape({
//   secretQuestion: yup.string().required('Secret question is required'),
//   secretAnswer: yup
//     .string()
//     .trim()
//     .matches(
//       onlyTextRegex,
//       'Only letters and single spaces between words are allowed',
//     )
//     .required('Secret answer is required'),
// });

// const MaintainPin: FC<MainStackScreenProps<'MaintainPin'>> = ({
//   navigation,
//   route,
// }) => {
//   const [otpVerified2, setOtpVerified2] = useState<boolean>(false);
//   const { otpVerified, enteredOtp, secretQuestion, secretAnswer } =
//     (route.params as any) || {};

//   const maintainTransactionPIN = useApi({ endpoint: 'maintainTransactionPIN' });
//   const getUserSecurityQuestions = useApi({
//     endpoint: 'getUserSecurityQuestions',
//   });

//   const formikRef = useRef<FormikProps<FormikValues>>(null);

//   const [state, setState] = useState<MaintainPinState>({
//     modalVisible: false,
//     newPinModalVisible: false,
//     confirmPinModalVisible: false,
//     loading_: false,
//     newPinValue: '',
//     confirmPinValue: '',
//   });

//   // Helper function to update state
//   const updateState = (updates: Partial<MaintainPinState>) => {
//     setState(prev => ({ ...prev, ...updates }));
//   };

//   // Destructure state for easier access
//   const {
//     modalVisible,
//     newPinModalVisible,
//     confirmPinModalVisible,
//     loading_,
//     newPinValue,
//     confirmPinValue,
//   } = state;

//   const { showError } = useAppToast();

//   // --- GET USER QUESTIONS IF NONE WAS PASSED ---
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       updateState({ loading_: true });
//       try {
//         const res = await getUserSecurityQuestions.requestInit();
//         if (res?.data?.code === '00') {
//           const len = res?.data?.data?.length;
//           const randomPick = randomNumber(0, len - 1);
//           formikRef.current?.setFieldValue(
//             'secretQuestion',
//             res?.data?.data[randomPick],
//           );
//         }
//       } finally {
//         updateState({ loading_: false });
//       }
//     };

//     if (secretQuestion && secretAnswer) {
//       formikRef.current?.setFieldValue('secretQuestion', secretQuestion);
//       formikRef.current?.setFieldValue('secretAnswer', secretAnswer);
//     } else {
//       fetchQuestions();
//     }
//   }, [secretQuestion, secretAnswer]);

//   // --- OPEN NEW PIN IF OTP VERIFIED ---
//   useEffect(() => {
//     if (otpVerified) updateState({ newPinModalVisible: true });
//   }, [otpVerified]);

//   // --- SHOW CONFIRM PIN WHEN NEW PIN IS COMPLETE ---
//   useEffect(() => {
//     if (newPinValue.length === 4) {
//       console.log('PIN complete, closing new pin modal');

//       // STEP 1: Close new pin modal first
//       updateState({
//         newPinModalVisible: false,
//       });

//       // STEP 2: Wait for modal animation to complete, then open confirm modal
//       setTimeout(() => {
//         console.log('Opening confirm pin modal');
//         setState(prev => ({
//           ...prev,
//           confirmPinModalVisible: true,
//           confirmPinValue: '', // Reset confirm value for clean slate
//         }));
//       }, 400); // 400ms delay ensures clean transition
//     }
//   }, [newPinValue]);

//   const maintainTransactionPin = async (payload: TnxPIN) => {
//     updateState({ loading_: true });
//     try {
//       const res = await maintainTransactionPIN.requestInit(
//         payload.request,
//         `/v1/customer/retail/transaction-pin?command=${payload.command}`,
//       );
//       if (res?.status === 200) {
//         // Close loading first
//         updateState({ loading_: false });

//         // Then show success modal after delay
//         setTimeout(() => {
//           setState(prev => ({
//             ...prev,
//             modalVisible: true,
//           }));
//         }, 400);

//         return true;
//       }
//       return false;
//     } catch (error) {
//       updateState({ loading_: false });
//       throw error;
//     }
//   };

//   const handleConfirmPin = async (val: string) => {
//     updateState({ confirmPinValue: val });

//     try {
//       if (val.length !== 4) return;

//       if (val !== newPinValue) {
//         showError("New & Confirm PIN doesn't match");

//         // PATTERN: Close current modal first
//         updateState({
//           confirmPinModalVisible: false,
//           confirmPinValue: '',
//         });

//         // Then open new pin modal after delay
//         setTimeout(() => {
//           setState(prev => ({
//             ...prev,
//             newPinModalVisible: true,
//             newPinValue: '', // Reset new pin value
//           }));
//         }, 400);
//         return;
//       }

//       const { secretQuestion, secretAnswer } = formikRef?.current?.values ?? {};

//       const payload = {
//         command: 'RESET',
//         request: {
//           newPin: val,
//           questionsAndAnswers: { [secretQuestion]: secretAnswer },
//           otp: enteredOtp,
//         },
//       };

//       // Save PIN
//       SAVE_P(val);

//       // Close confirm modal and show loading
//       updateState({
//         confirmPinModalVisible: false,
//         loading_: true,
//       });

//       // Execute the API call
//       await maintainTransactionPin(payload);
//     } catch (err: any) {
//       updateState({ loading_: false });
//       showError(err.message || 'An error occurred');
//     }
//   };

//   return (
//     <PageContainer>
//       <HeaderAuth headerTitle="Create/Reset Transaction Pin" noLogo />

//       {/* SUCCESS MODAL (Always mounted) */}
//       <SuccessModal
//         isVisible={modalVisible}
//         title={`Transaction PIN \n Maintained Successfully`}
//         onBackdropPress={() => {}}
//         onBackButtonPress={() => {}}
//         onSwipeComplete={() => {}}
//         closeModal={() => {
//           updateState({ modalVisible: false });
//         }}
//         onPress={() => {
//           updateState({
//             modalVisible: false,
//             newPinModalVisible: false,
//             confirmPinModalVisible: false,
//             newPinValue: '',
//             confirmPinValue: '',
//           });
//         }}
//       />

//       {/* LOADER (Always mounted) */}
//       <LoadingModal
//         isVisible={loading_}
//         onBackdropPress={() => {}}
//         onBackButtonPress={() => {}}
//       />

//       {/* NEW PIN MODAL (Always mounted) */}
//       <NewPinModal
//         isVisible={newPinModalVisible}
//         value={newPinValue}
//         setValue={val => updateState({ newPinValue: val })}
//         onBackdropPress={() => {
//           updateState({
//             newPinModalVisible: false,
//             newPinValue: '',
//           });
//           setOtpVerified2(false);
//         }}
//         onBackButtonPress={() => {
//           updateState({
//             newPinModalVisible: false,
//             newPinValue: '',
//           });
//           setOtpVerified2(false);
//         }}
//       />

//       {/* CONFIRM PIN MODAL (Always mounted) */}
//       <ConfirmPinModal
//         isVisible={confirmPinModalVisible}
//         value={confirmPinValue}
//         setValue={handleConfirmPin}
//         onBackdropPress={() => {
//           updateState({
//             confirmPinModalVisible: false,
//             confirmPinValue: '',
//           });
//         }}
//         onBackButtonPress={() => {
//           updateState({
//             confirmPinModalVisible: false,
//             confirmPinValue: '',
//           });
//         }}
//       />

//       <Formik
//         innerRef={formikRef}
//         validationSchema={securityValidationSchema}
//         initialValues={{
//           secretQuestion: secretQuestion || '',
//           secretAnswer: secretAnswer || '',
//         }}
//         onSubmit={values => {
//           navigation.navigate('TransactionPinOTP', {
//             item: values,
//           });
//         }}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//           isValid,
//           dirty,
//         }) => (
//           <View flex={1}>
//             <YStack marginTop={32} gap={20}>
//               <Input
//                 value={values.secretQuestion}
//                 label="Secret Question"
//                 editable={false}
//                 loading={loading_}
//               />
//               <Input
//                 value={values.secretAnswer}
//                 label="Secret Answer"
//                 placeholder="Answer"
//                 onChangeText={handleChange('secretAnswer')}
//                 onBlur={handleBlur('secretAnswer')}
//                 error={touched.secretAnswer && errors.secretAnswer}
//               />
//             </YStack>

//             <Button
//               marginTop="auto"
//               onPress={() => handleSubmit()}
//               disabled={!(isValid && dirty)}
//             >
//               Proceed
//             </Button>
//           </View>
//         )}
//       </Formik>
//     </PageContainer>
//   );
// };

// export default MaintainPin;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import Button from '../../../components/Button';
import SuccessModal from '../../../components/modals/SuccessModal';
import LoadingModal from '../../../components/modals/LoadingModal';
import ConfirmPinModal from '../../../components/modals/ConfirmPinModal';
import { TnxPIN } from '../../../types/settings.types';
import NewPinModal from '../../../components/modals/NewPinModal';
import { SAVE_P } from '../../../services/storage';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import { View, YStack } from 'tamagui';
import Input from '../../../components/Input';
import randomNumber from '../../../util/randomNumber';
import { onlyTextRegex } from '../../../util/regex';
import { useAppToast } from '../../../hooks/useAppToast';

interface MaintainPinState {
  modalVisible: boolean;
  newPinModalVisible: boolean;
  confirmPinModalVisible: boolean;
  loading_: boolean;
  newPinValue: string;
  confirmPinValue: string;
}

const securityValidationSchema = yup.object().shape({
  secretQuestion: yup.string().required('Secret question is required'),
  secretAnswer: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Secret answer is required'),
});

const MaintainPin: FC<MainStackScreenProps<'MaintainPin'>> = ({
  navigation,
  route,
}) => {
  const [otpVerified2, setOtpVerified2] = useState<boolean>(false);
  const { otpVerified, enteredOtp, secretQuestion, secretAnswer } =
    (route.params as any) || {};

  const maintainTransactionPIN = useApi({ endpoint: 'maintainTransactionPIN' });
  const getUserSecurityQuestions = useApi({
    endpoint: 'getUserSecurityQuestions',
  });

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const [state, setState] = useState<MaintainPinState>({
    modalVisible: false,
    newPinModalVisible: false,
    confirmPinModalVisible: false,
    loading_: false,
    newPinValue: '',
    confirmPinValue: '',
  });

  // Helper function to update state
  const updateState = (updates: Partial<MaintainPinState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Destructure state for easier access
  const {
    modalVisible,
    newPinModalVisible,
    confirmPinModalVisible,
    loading_,
    newPinValue,
    confirmPinValue,
  } = state;

  const { showError } = useAppToast();

  // --- GET USER QUESTIONS IF NONE WAS PASSED ---
  useEffect(() => {
    const fetchQuestions = async () => {
      updateState({ loading_: true });
      try {
        const res = await getUserSecurityQuestions.requestInit();
        if (res?.data?.code === '00') {
          const len = res?.data?.data?.length;
          const randomPick = randomNumber(0, len - 1);
          formikRef.current?.setFieldValue(
            'secretQuestion',
            res?.data?.data[randomPick],
          );
        }
      } finally {
        updateState({ loading_: false });
      }
    };

    if (secretQuestion && secretAnswer) {
      formikRef.current?.setFieldValue('secretQuestion', secretQuestion);
      formikRef.current?.setFieldValue('secretAnswer', secretAnswer);
    } else {
      fetchQuestions();
    }
  }, [secretQuestion, secretAnswer]);

  // --- OPEN NEW PIN IF OTP VERIFIED ---
  useEffect(() => {
    if (otpVerified) updateState({ newPinModalVisible: true });
  }, [otpVerified]);

  // --- SHOW CONFIRM PIN WHEN NEW PIN IS COMPLETE ---
  useEffect(() => {
    if (newPinValue.length === 4) {
      console.log('PIN complete, closing new pin modal');

      // STEP 1: Close new pin modal first
      updateState({
        newPinModalVisible: false,
      });

      // STEP 2: Wait for modal animation to complete, then open confirm modal
      setTimeout(() => {
        console.log('Opening confirm pin modal');
        setState(prev => ({
          ...prev,
          confirmPinModalVisible: true,
          confirmPinValue: '', // Reset confirm value for clean slate
        }));
      }, 400); // 400ms delay ensures clean transition
    }
  }, [newPinValue]);

  // const maintainTransactionPin = async (payload: TnxPIN) => {
  //   try {
  //     const res = await maintainTransactionPIN.requestInit(
  //       payload.request,
  //       `/v1/customer/retail/transaction-pin?command=${payload.command}`,
  //     );
  //     if (res?.status === 200) {
  //       console.log('Transaction PIN maintained successfully');
  //       // Close loading first
  //       updateState({ loading_: false });

  //       // Then show success modal after delay
  //       setTimeout(() => {
  //         setState(prev => ({
  //           ...prev,
  //           modalVisible: true,
  //         }));
  //       }, 400);

  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     updateState({ loading_: false });
  //     throw error;
  //   }
  // };

  // const handleConfirmPin = async (val: string) => {
  //   updateState({ confirmPinValue: val });

  //   try {
  //     if (val.length !== 4) return;

  //     if (val !== newPinValue) {
  //       showError("New & Confirm PIN doesn't match");

  //       // PATTERN: Close current modal first
  //       updateState({
  //         confirmPinModalVisible: false,
  //         confirmPinValue: '',
  //       });

  //       // Then open new pin modal after delay
  //       setTimeout(() => {
  //         setState(prev => ({
  //           ...prev,
  //           newPinModalVisible: true,
  //           newPinValue: '', // Reset new pin value
  //         }));
  //       }, 400);
  //       return;
  //     }

  //     const { secretQuestion, secretAnswer } = formikRef?.current?.values ?? {};

  //     const payload = {
  //       command: 'RESET',
  //       request: {
  //         newPin: val,
  //         questionsAndAnswers: { [secretQuestion]: secretAnswer },
  //         otp: enteredOtp,
  //       },
  //     };

  //     // Save PIN
  //     SAVE_P(val);

  //     // STEP 1: Close confirm modal first
  //     updateState({
  //       confirmPinModalVisible: false,
  //     });

  //     // STEP 2: Wait for modal to close, then show loading and execute API
  //     setTimeout(async () => {
  //       // Show loading modal
  //       setState(prev => ({
  //         ...prev,
  //         loading_: true,
  //       }));

  //       // Execute the API call
  //       try {
  //         await maintainTransactionPin(payload);
  //       } catch (err: any) {
  //         updateState({ loading_: false });
  //         showError(err.message || 'An error occurred');
  //       }
  //     }, 400);
  //   } catch (err: any) {
  //     showError(err.message || 'An error occurred');
  //   }
  // };

  const maintainTransactionPin = async (payload: TnxPIN) => {
    try {
      const res = await maintainTransactionPIN.requestInit(
        payload.request,
        `/v1/customer/retail/transaction-pin?command=${payload.command}`,
      );

      if (res?.status === 200) {
        console.log('Transaction PIN maintained successfully');

        // Close loading modal
        updateState({ loading_: false });

        // IMPORTANT: Use setTimeout to ensure state updates sequentially
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            modalVisible: true,
          }));
        }, 100);

        return true;
      } else {
        // Handle API error response
        updateState({ loading_: false });
        showError(res?.data?.message || 'Failed to maintain transaction PIN');
        return false;
      }
    } catch (error: any) {
      updateState({ loading_: false });
      showError(error.message || 'An error occurred');
      throw error;
    }
  };

  const handleConfirmPin = async (val: string) => {
    updateState({ confirmPinValue: val });

    try {
      if (val.length !== 4) return;

      if (val !== newPinValue) {
        showError("New & Confirm PIN doesn't match");

        // Close confirm modal and reset
        updateState({
          confirmPinModalVisible: false,
          confirmPinValue: '',
        });

        // Open new pin modal after delay
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            newPinModalVisible: true,
            newPinValue: '',
          }));
        }, 400);
        return;
      }

      const { secretQuestion, secretAnswer } = formikRef?.current?.values ?? {};

      const payload = {
        command: 'RESET',
        request: {
          newPin: val,
          questionsAndAnswers: { [secretQuestion]: secretAnswer },
          otp: enteredOtp,
        },
      };

      // Save PIN
      SAVE_P(val);

      // Close confirm modal and show loading
      updateState({
        confirmPinModalVisible: false,
        loading_: true,
      });

      // Execute the API call
      await maintainTransactionPin(payload);
    } catch (err: any) {
      updateState({ loading_: false });
      showError(err.message || 'An error occurred');
    }
  };

  return (
    <PageContainer>
      <HeaderAuth headerTitle="Create/Reset Transaction Pin" noLogo />

      {/* SUCCESS MODAL (Always mounted) */}
      <SuccessModal
        isVisible={modalVisible}
        title={`Transaction PIN \n Maintained Successfully`}
        onBackdropPress={() => {}}
        onBackButtonPress={() => {}}
        onSwipeComplete={() => {}}
        closeModal={() => {
          updateState({ modalVisible: false });
        }}
        onPress={() => {
          updateState({
            modalVisible: false,
            newPinModalVisible: false,
            confirmPinModalVisible: false,
            newPinValue: '',
            confirmPinValue: '',
          });
        }}
      />

      {/* LOADER (Always mounted) */}
      <LoadingModal
        isVisible={loading_}
        onBackdropPress={() => {}}
        onBackButtonPress={() => {}}
      />

      {/* NEW PIN MODAL (Always mounted) */}
      <NewPinModal
        isVisible={newPinModalVisible}
        value={newPinValue}
        setValue={val => updateState({ newPinValue: val })}
        onBackdropPress={() => {
          updateState({
            newPinModalVisible: false,
            newPinValue: '',
          });
          setOtpVerified2(false);
        }}
        onBackButtonPress={() => {
          updateState({
            newPinModalVisible: false,
            newPinValue: '',
          });
          setOtpVerified2(false);
        }}
      />

      {/* CONFIRM PIN MODAL (Always mounted) */}
      <ConfirmPinModal
        isVisible={confirmPinModalVisible}
        value={confirmPinValue}
        setValue={handleConfirmPin}
        onBackdropPress={() => {
          updateState({
            confirmPinModalVisible: false,
            confirmPinValue: '',
          });
        }}
        onBackButtonPress={() => {
          updateState({
            confirmPinModalVisible: false,
            confirmPinValue: '',
          });
        }}
      />

      <Formik
        innerRef={formikRef}
        validationSchema={securityValidationSchema}
        initialValues={{
          secretQuestion: secretQuestion || '',
          secretAnswer: secretAnswer || '',
        }}
        onSubmit={values => {
          navigation.navigate('TransactionPinOTP', {
            item: values,
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <Input
                value={values.secretQuestion}
                label="Secret Question"
                editable={false}
                loading={loading_}
              />
              <Input
                value={values.secretAnswer}
                label="Secret Answer"
                placeholder="Answer"
                onChangeText={handleChange('secretAnswer')}
                onBlur={handleBlur('secretAnswer')}
                error={touched.secretAnswer && errors.secretAnswer}
              />
            </YStack>

            <Button
              marginTop="auto"
              onPress={() => handleSubmit()}
              disabled={!(isValid && dirty)}
            >
              Proceed
            </Button>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default MaintainPin;
