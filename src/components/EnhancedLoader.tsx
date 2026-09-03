import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Spinner, Text, YStack } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EnhancedLoaderProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  showText?: boolean;
  color?: string;
  backgroundColor?: string;
  progress?: number; // 0-100
  lines?: number; // For skeleton loader
  height?: number;
  width?: number;
}

const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  showText = true,
  color,
  backgroundColor,
  progress = 0,
  lines = 3,
  height,
  width,
}) => {
  const { colors } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (type === 'dots' || type === 'pulse') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }
  }, [type, animatedValue]);

  // const getSize = React.memo(() => {
  //   switch (size) {
  //     case 'xs':
  //       return 16;
  //     case 'sm':
  //       return 24;
  //     case 'md':
  //       return 32;
  //     case 'lg':
  //       return 48;
  //     case 'xl':
  //       return 64;
  //     default:
  //       return 32;
  //   }
  // });

  // const getTextSize = React.memo(() => {
  //   switch (size) {
  //     case 'xs':
  //       return typography.caption.fontSize;
  //     case 'sm':
  //       return typography.bodySmall.fontSize;
  //     case 'md':
  //       return typography.bodyMedium.fontSize;
  //     case 'lg':
  //       return typography.bodyLarge.fontSize;
  //     case 'xl':
  //       return typography.h5.fontSize;
  //     default:
  //       return typography.bodyMedium.fontSize;
  //   }
  // });

  // const renderLoader = React.memo(() => {
  //   const loaderColor = color || colors.primary;
  //   const loaderSize = getSize();

  //   switch (type) {
  //     case 'spinner':
  //       return <Spinner size={loaderSize} color={loaderColor} />;

  //     case 'dots':
  //       return (
  //         <View style={styles.dotsContainer}>
  //           {[0, 1, 2].map(index => (
  //             <Animated.View
  //               key={index}
  //               style={[
  //                 styles.dot,
  //                 {
  //                   backgroundColor: loaderColor,
  //                   width: loaderSize / 4,
  //                   height: loaderSize / 4,
  //                   borderRadius: loaderSize / 8,
  //                   opacity: animatedValue.interpolate({
  //                     inputRange: [0, 1],
  //                     outputRange: [0.3, 1],
  //                   }),
  //                   transform: [
  //                     {
  //                       scale: animatedValue.interpolate({
  //                         inputRange: [0, 1],
  //                         outputRange: [0.8, 1.2],
  //                       }),
  //                     },
  //                   ],
  //                 },
  //               ]}
  //             />
  //           ))}
  //         </View>
  //       );

  //     case 'pulse':
  //       return (
  //         <Animated.View
  //           style={[
  //             styles.pulse,
  //             {
  //               backgroundColor: loaderColor,
  //               width: loaderSize,
  //               height: loaderSize,
  //               borderRadius: loaderSize / 2,
  //               opacity: animatedValue.interpolate({
  //                 inputRange: [0, 1],
  //                 outputRange: [0.3, 1],
  //               }),
  //               transform: [
  //                 {
  //                   scale: animatedValue.interpolate({
  //                     inputRange: [0, 1],
  //                     outputRange: [0.8, 1.2],
  //                   }),
  //                 },
  //               ],
  //             },
  //           ]}
  //         />
  //       );

  //     case 'skeleton':
  //       return (
  //         <View style={styles.skeletonContainer}>
  //           {Array.from({ length: lines }).map((_, index) => (
  //             <View
  //               key={index}
  //               style={[
  //                 styles.skeletonLine,
  //                 {
  //                   backgroundColor: colors.lightGrey,
  //                   height: height || 16,
  //                   width: width || '100%',
  //                   marginBottom:
  //                     index < lines - 1 ? spacing.component.gap.sm : 0,
  //                 },
  //               ]}
  //             />
  //           ))}
  //         </View>
  //       );

  //     case 'progress':
  //       return (
  //         <View style={styles.progressContainer}>
  //           <View
  //             style={[
  //               styles.progressTrack,
  //               {
  //                 backgroundColor: colors.lightGrey,
  //                 height: height || 8,
  //                 width: width || 200,
  //               },
  //             ]}
  //           >
  //             <Animated.View
  //               style={[
  //                 styles.progressFill,
  //                 {
  //                   backgroundColor: loaderColor,
  //                   height: '100%',
  //                   width: `${progress}%`,
  //                 },
  //               ]}
  //             />
  //           </View>
  //           {showText && (
  //             <Text
  //               style={[
  //                 styles.progressText,
  //                 {
  //                   fontSize: getTextSize(),
  //                   color: colors.textSecondary,
  //                   marginTop: spacing.component.gap.xs,
  //                 },
  //               ]}
  //             >
  //               {progress}%
  //             </Text>
  //           )}
  //         </View>
  //       );

  //     default:
  //       return <Spinner size={loaderSize} color={loaderColor} />;
  //   }
  // });

  const getSize = () => {
    switch (size) {
      case 'xs':
        return 16;
      case 'sm':
        return 24;
      case 'md':
        return 32;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      default:
        return 32;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'xs':
        return typography.caption.fontSize;
      case 'sm':
        return typography.bodySmall.fontSize;
      case 'md':
        return typography.bodyMedium.fontSize;
      case 'lg':
        return typography.bodyLarge.fontSize;
      case 'xl':
        return typography.h5.fontSize;
      default:
        return typography.bodyMedium.fontSize;
    }
  };

  const renderLoader = () => {
    const loaderColor = color || colors.primary;
    const loaderSize = getSize();

    switch (type) {
      case 'spinner':
        return <Spinner size={loaderSize} color={loaderColor} />;

      case 'dots':
        return (
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map(index => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: loaderColor,
                    width: loaderSize / 4,
                    height: loaderSize / 4,
                    borderRadius: loaderSize / 8,
                    opacity: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scale: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        );

      case 'pulse':
        return (
          <Animated.View
            style={[
              styles.pulse,
              {
                backgroundColor: loaderColor,
                width: loaderSize,
                height: loaderSize,
                borderRadius: loaderSize / 2,
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        );

      case 'skeleton':
        return (
          <View style={styles.skeletonContainer}>
            {Array.from({ length: lines }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.skeletonLine,
                  {
                    backgroundColor: colors.lightGrey,
                    height: height || 16,
                    width: width || '100%',
                    marginBottom:
                      index < lines - 1 ? spacing.component.gap.sm : 0,
                  },
                ]}
              />
            ))}
          </View>
        );

      case 'progress':
        return (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: colors.lightGrey,
                  height: height || 8,
                  width: width || 200,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: loaderColor,
                    height: '100%',
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            {showText && (
              <Text
                style={[
                  styles.progressText,
                  {
                    fontSize: getTextSize(),
                    color: colors.textSecondary,
                    marginTop: spacing.component.gap.xs,
                  },
                ]}
              >
                {progress}%
              </Text>
            )}
          </View>
        );

      default:
        return <Spinner size={loaderSize} color={loaderColor} />;
    }
  };

  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      space={showText ? spacing.component.gap.sm : 0}
      backgroundColor={backgroundColor}
      padding={spacing.component.padding.md}
    >
      {renderLoader()}
      {showText && text && (
        <Text
          style={[
            styles.loaderText,
            {
              fontSize: getTextSize(),
              color: color || colors.textSecondary,
              textAlign: 'center',
            },
          ]}
        >
          {text}
        </Text>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    marginHorizontal: 2,
  },
  pulse: {
    // Styles applied dynamically
  },
  skeletonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonLine: {
    borderRadius: 4,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
  },
  loaderText: {
    fontFamily: 'Inter-Regular',
  },
});

export default EnhancedLoader;
