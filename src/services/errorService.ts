import { Platform } from 'react-native';
import { ErrorDetails } from '../hooks/useErrorHandler';

export interface ErrorReport {
  error: Error | string;
  errorDetails?: ErrorDetails;
  context?: string;
  timestamp: string;
  platform: string;
  appVersion?: string;
  deviceInfo?: {
    brand?: string;
    model?: string;
    systemVersion?: string;
  };
  userInfo?: {
    userId?: string;
    username?: string;
  };
  stackTrace?: string;
  additionalData?: Record<string, any>;
}

class ErrorService {
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;
  private maxQueueSize = 100;

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (__DEV__) {
      // In development, log to console
      this.setupDevErrorHandlers();
    } else {
      // In production, set up proper error handlers
      this.setupProdErrorHandlers();
    }
  }

  private setupDevErrorHandlers() {
    // Handle unhandled promise rejections in development
    const originalHandler = global.ErrorUtils?.setGlobalHandler;
    if (originalHandler) {
      global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {


        this.reportError(error, 'UnhandledError', { isFatal });
      });
    }

    // Handle unhandled promise rejections
    if (global.addEventListener) {
      global.addEventListener('unhandledrejection', event => {

        this.reportError(event.reason, 'UnhandledPromiseRejection');
      });
    }
  }

  private setupProdErrorHandlers() {
    // In production, you might want to send errors to a service like Sentry
    // For now, we'll just log them
    if (global.ErrorUtils?.setGlobalHandler) {
      global.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        this.reportError(error, 'UnhandledError', { isFatal });
      });
    }

    if (global.addEventListener) {
      global.addEventListener('unhandledrejection', event => {
        this.reportError(event.reason, 'UnhandledPromiseRejection');
      });
    }
  }

  async reportError(
    error: Error | string,
    context?: string,
    additionalData?: Record<string, any>,
  ): Promise<void> {
    const errorReport: ErrorReport = {
      error,
      context,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      stackTrace: error instanceof Error ? error.stack : undefined,
      additionalData,
    };

    // Add to queue
    this.errorQueue.push(errorReport);

    // Limit queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log in development
    if (__DEV__) {

    }

    // Try to send error report
    await this.flushErrorQueue();
  }

  async reportErrorWithDetails(
    error: Error | string,
    errorDetails: ErrorDetails,
    context?: string,
    additionalData?: Record<string, any>,
  ): Promise<void> {
    const errorReport: ErrorReport = {
      error,
      errorDetails,
      context,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      stackTrace: error instanceof Error ? error.stack : undefined,
      additionalData,
    };

    this.errorQueue.push(errorReport);

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    if (__DEV__) {

    }

    await this.flushErrorQueue();
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;

    try {
      const errorsToReport = [...this.errorQueue];
      this.errorQueue = [];

      for (const errorReport of errorsToReport) {
        await this.sendErrorReport(errorReport);
      }
    } catch (error) {

      // Put errors back in queue for retry
      this.errorQueue.unshift(...this.errorQueue);
    } finally {
      this.isReporting = false;
    }
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      // In production, you would send this to your error reporting service
      // For now, we'll just log it
      if (__DEV__) {

      }

      // Example: Send to your backend API
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });

      // Example: Send to Sentry
      // Sentry.captureException(errorReport.error, {
      //   extra: errorReport,
      //   tags: { context: errorReport.context },
      // });
    } catch (error) {

      throw error;
    }
  }

  // Get all reported errors (useful for debugging)
  getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue];
  }

  // Clear error queue
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  // Set user information for error reports
  setUserInfo(userId: string, username: string): void {
    // Update all pending error reports with user info
    this.errorQueue.forEach(report => {
      report.userInfo = { userId, username };
    });
  }

  // Set device information
  setDeviceInfo(brand: string, model: string, systemVersion: string): void {
    this.errorQueue.forEach(report => {
      report.deviceInfo = { brand, model, systemVersion };
    });
  }

  // Set app version
  setAppVersion(version: string): void {
    this.errorQueue.forEach(report => {
      report.appVersion = version;
    });
  }
}

// Export singleton instance
export const errorService = new ErrorService();

export default errorService;
