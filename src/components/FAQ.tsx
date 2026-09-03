/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Accordion,
  Paragraph,
  Text,
  YStack,
  Square,
  ScrollView,
} from 'tamagui';
import { ArrowDown2 } from 'iconsax-react-native';
import { FAQProps } from '../types';
import { useTheme } from '../context/ThemeContext';

const FAQ = ({ faqs }: FAQProps) => {
  const { colors } = useTheme();

  return (
    <YStack flex={1} paddingInline={24} alignItems="center">
      <Text
        maxWidth={220}
        textAlign="center"
        lineHeight={24}
        color={colors.grey06}
        fontSize={20}
        marginTop={24}
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
        <Accordion gap={8} marginTop={40} width="100%" type="multiple">
          {faqs?.map(({ question, answer, DT_RowId }) => (
            <Accordion.Item value={question} key={DT_RowId}>
              <Accordion.Trigger
                backgroundColor={colors.borderColor}
                padding={16}
                borderRadius={16}
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
                  backgroundColor={colors.white}
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
  );
};

export default FAQ;
