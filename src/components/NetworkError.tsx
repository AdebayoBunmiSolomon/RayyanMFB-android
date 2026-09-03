import React from 'react';
import { View, StyleSheet } from 'react-native';
import { YStack, Button, Label, XStack } from 'tamagui';
import { ErrorDetails } from '../hooks/useErrorHandler';

interface NetworkErrorProps {
  error: ErrorDetails;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  showDismiss?: boolean;
  title?: string;
  message?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
  error,
  onRetry,
  onDismiss,
  showRetry = true,
  showDismiss = false,
  title,
  message,
}) => {
  const getErrorIcon = () => {
    switch (error.category) {
      case 'network':
        return '📡';
      case 'server':
        return '🖥️';
      case 'auth':
        return '🔐';
      case 'validation':
        return '⚠️';
      default:
        return '❌';
    }
  };

  const getErrorColor = () => {
    switch (error.category) {
      case 'network':
        return '#FF9500'; // warning orange
      case 'server':
        return '#FF3B30'; // error red
      case 'auth':
        return '#FF3B30'; // error red
      case 'validation':
        return '#FF9500'; // warning orange
      default:
        return '#FF3B30'; // error red
    }
  };

  const displayTitle = title || error.code || 'Error';
  const displayMessage = message || error.message;

  return (
    <View style={styles.container}>
      <YStack space="$4" alignItems="center" padding="$4">
        <View style={styles.iconContainer}>
          <Label fontSize={48}>{getErrorIcon()}</Label>
        </View>

        <YStack space="$2" alignItems="center">
          <Label
            fontSize={20}
            fontWeight="bold"
            color={getErrorColor()}
            textAlign="center"
          >
            {displayTitle}
          </Label>

          <Label
            fontSize={16}
            color="#666666"
            textAlign="center"
            lineHeight={24}
            maxWidth="90%"
          >
            {displayMessage}
          </Label>
        </YStack>

        {error.retryable && (
          <Label
            fontSize={14}
            color="#8E8E93"
            textAlign="center"
            fontStyle="italic"
          >
            This error may be temporary. You can try again.
          </Label>
        )}

        <XStack space="$3" width="100%" justifyContent="center">
          {showRetry && error.retryable && onRetry && (
            <Button
              onPress={onRetry}
              backgroundColor="#007AFF"
              color="white"
              size="$4"
              flex={1}
              maxWidth={200}
            >
              Try Again
            </Button>
          )}

          {showDismiss && onDismiss && (
            <Button
              onPress={onDismiss}
              backgroundColor="#8E8E93"
              color="white"
              size="$4"
              variant="outlined"
              flex={1}
              maxWidth={200}
            >
              Dismiss
            </Button>
          )}
        </XStack>

        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Label fontSize={12} color="#8E8E93">
              Debug: {error.category} - {error.code}
            </Label>
            {error.status && (
              <Label fontSize={12} color="#8E8E93">
                Status: {error.status}
              </Label>
            )}
          </View>
        )}
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 10,
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default NetworkError;
