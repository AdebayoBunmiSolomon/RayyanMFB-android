import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { YStack, Button } from 'tamagui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  renderError?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {

    this.setState({
      error,
      errorInfo,
    });

    // Report error to parent
    this.props.onError?.(error, errorInfo);

    // Show alert to user
    Alert.alert(
      'App Error',
      'Something went wrong. The app will try to recover.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Try to recover by resetting error state
            this.setState({
              hasError: false,
              error: null,
              errorInfo: null,
            });
          },
        },
      ],
    );
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRestart = () => {
    // Force app restart by clearing state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Additional cleanup if needed
    if (Platform.OS === 'android') {
      // Android specific restart logic

    }
  };

  render() {
    // If there's a render error, show a very basic fallback
    if (this.state.renderError) {
      return (
        <View style={styles.basicContainer}>
          <Text style={styles.basicTitle}>Critical Error</Text>
          <Text style={styles.basicMessage}>
            The app encountered a critical error and cannot continue.
          </Text>
          <Text style={styles.basicMessage}>
            Please restart the application.
          </Text>
        </View>
      );
    }

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      try {
        return (
          <View style={styles.container}>
            <YStack space="$4" alignItems="center" padding="$4">
              <Text style={styles.title}>Something went wrong</Text>
              <Text style={styles.message}>
                We're sorry, but something unexpected happened. Please try
                again.
              </Text>

              {__DEV__ && this.state.error && (
                <View style={styles.debugContainer}>
                  <Text style={styles.debugTitle}>Debug Information:</Text>
                  <Text style={styles.debugText}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.debugText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}

              <YStack space="$3" width="100%">
                <Button
                  onPress={this.handleRetry}
                  backgroundColor="#007AFF"
                  color="white"
                  size="$4"
                >
                  Try Again
                </Button>

                <Button
                  onPress={this.handleRestart}
                  backgroundColor="#D4AF37"
                  color="white"
                  size="$4"
                  variant="outlined"
                >
                  Restart App
                </Button>
              </YStack>
            </YStack>
          </View>
        );
      } catch (renderError) {
        // If even the error UI fails to render, show basic fallback

        this.setState({ renderError: renderError as Error });
        return (
          <View style={styles.basicContainer}>
            <Text style={styles.basicTitle}>Critical Error</Text>
            <Text style={styles.basicMessage}>
              The app encountered a critical error and cannot continue.
            </Text>
            <Text style={styles.basicMessage}>
              Please restart the application.
            </Text>
          </View>
        );
      }
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#167076',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#167076',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  restartButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  basicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  basicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  basicMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 5,
  },
  debugContainer: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});

export default ErrorBoundary;
