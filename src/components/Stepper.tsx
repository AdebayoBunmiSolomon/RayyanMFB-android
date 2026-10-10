import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  LayoutAnimation,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { StepperProps } from '../types';
import { YStack, View } from 'tamagui';
import uiColors from '../theme/color';
import { normalizeSize } from '../util/size';

const Stepper = ({ steps, ...others }: StepperProps) => {
  const [labelWidths, setLabelWidths] = useState<number[]>([]);

  const { colors } = useTheme();

  const handleLabelLayout = (event: LayoutChangeEvent, index: number) => {
    const { width } = event.nativeEvent.layout;
    setLabelWidths(prev => {
      const newWidths = [...prev] as number[];
      newWidths[index] = width;
      return newWidths;
    });
  };

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [labelWidths]);

  return (
    <View style={{ ...styles.container }} {...others}>
      {steps.map((step, index) => {
        const labelWidth = labelWidths[index] || 0;
        const nextLabelWidth = labelWidths[index + 1] || 0;

        return (
          <React.Fragment key={index}>
            {/* Circle */}
            <View style={styles.stepWrapper}>
              <View
                style={[
                  styles.circle,
                  step.completed
                    ? styles.circleCompleted
                    : styles.circlePending,
                ]}
              >
                {step.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <YStack onLayout={e => handleLabelLayout(e, index)}>
                {step.current ? (
                  <View
                    backgroundColor={'#F5B30D'}
                    width={10}
                    height={10}
                    position="absolute"
                    left={labelWidth / 2 - 5}
                    top={8}
                    rotate="50deg"
                    zIndex={-1}
                  />
                ) : (
                  ''
                )}
                <Text
                  style={[
                    styles.label,
                    { color: colors.grey05 },
                    step.current ? styles.highlightLabel : {},
                  ]}
                >
                  {step.current ? step?.currentLabel : step.label}
                </Text>
              </YStack>
            </View>

            {/* Line */}
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  {
                    marginLeft: -(labelWidth / 2) + 11,
                    marginRight: -(nextLabelWidth / 2) + 10,
                  },
                  steps[index].completed && steps[index + 1].completed
                    ? styles.lineActive
                    : styles.lineInactive,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  stepWrapper: {
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F5B30D',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 9999,
  },
  circleCompleted: {
    backgroundColor: '#F5B30D',
  },
  circlePending: {
    backgroundColor: 'transparent',
    borderColor: uiColors.grey,
  },
  checkmark: {
    color: '#1B1F3A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  label: {
    marginTop: 12,
    fontSize: normalizeSize(12),
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
  },
  highlightLabel: {
    fontWeight: '600',
    color: uiColors.grey06,
    backgroundColor: '#F5B30D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: -2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  line: {
    height: 2,
    flex: 1,
    position: 'relative',
    top: -14,
  },
  lineActive: {
    backgroundColor: '#F5B30D',
  },
  lineInactive: {
    backgroundColor: uiColors.grey,
  },
});

export default Stepper;
