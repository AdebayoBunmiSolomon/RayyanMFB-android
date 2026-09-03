/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import { ArrowDown2 } from 'iconsax-react-native';
import {
  YStack,
  Accordion,
  Paragraph,
  Square,
  Text,
  ScrollView,
} from 'tamagui';
import { FAQTypes } from '../../../types/public.types';
import { useApi } from '../../../hooks/useApi';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useTheme } from '../../../context/ThemeContext';

const FaqScreen = () => {
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQTypes[]>([]);

  const getFaq = useApi({ endpoint: 'getFaq' });
  const { colors } = useTheme();

  useEffect(() => {
    const getFrequentlyAskedQuestions = async () => {
      setLoading(true);
      try {
        const res = await getFaq.requestInit();
        if (res?.data) {
          setFaqs(res?.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getFrequentlyAskedQuestions();
  }, []);

  return (
    <PageContainer>
      {
        <LoadingModal
          isVisible={loading}
          onBackdropPress={() => setLoading(true)}
          onBackButtonPress={() => setLoading(true)}
        />
      }
      <HeaderAuth noLogo headerTitle="FAQ" />
      <YStack flex={1} alignItems="center">
        <Text
          maxWidth={220}
          textAlign="center"
          lineHeight={24}
          color={colors.grey06}
          fontSize={20}
          marginTop={40}
          fontWeight="700"
        >
          Frequently Asked Questions:
        </Text>
        {/* accordion */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          paddingBottom={48}
          flex={1}
          contentContainerStyle={{ flexGrow: 1 }}
          nestedScrollEnabled
          width="100%"
        >
          <Accordion gap={8} marginTop={24} width="100%" type="multiple">
            {faqs?.map(({ question, answer, DT_RowId }) => (
              <Accordion.Item value={question} key={DT_RowId}>
                <Accordion.Trigger
                  backgroundColor={colors.input}
                  padding={20}
                  borderRadius={14}
                  borderWidth={0}
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  {({ open }: { open: boolean }) => (
                    <>
                      <Paragraph
                        fontSize={15}
                        color={colors.grey05}
                        fontWeight="600"
                      >
                        {question}
                      </Paragraph>
                      <Square rotate={open ? '180deg' : '0deg'}>
                        <ArrowDown2 color={colors.grey05} size={18} />
                      </Square>
                    </>
                  )}
                </Accordion.Trigger>
                <Accordion.HeightAnimator>
                  <Accordion.Content
                    backgroundColor={colors.background}
                    borderWidth={1}
                    borderColor={colors.borderColor}
                    borderRadius={16}
                    width="100%"
                    flex={1}
                    padding={16}
                    marginBlock={10}
                    exitStyle={{ opacity: 0 }}
                  >
                    <Paragraph
                      color={colors.grey05}
                      fontWeight="500"
                      lineHeight={20}
                      fontSize={15}
                    >
                      {answer}
                    </Paragraph>
                  </Accordion.Content>
                </Accordion.HeightAnimator>
              </Accordion.Item>
            ))}
          </Accordion>
        </ScrollView>
      </YStack>
    </PageContainer>
  );
};

export default FaqScreen;
