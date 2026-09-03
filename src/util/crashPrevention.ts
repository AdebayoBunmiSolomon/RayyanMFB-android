import { AppState, Platform } from 'react-native';

/**
 * Crash Prevention Utility
 * Helps prevent app crashes by monitoring app state and cleaning up resources
 */

class CrashPrevention {
  private static instance: CrashPrevention;
  private appStateTimeout: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  static getInstance(): CrashPrevention {
    if (!CrashPrevention.instance) {
      CrashPrevention.instance = new CrashPrevention();
    }
    return CrashPrevention.instance;
  }

  /**
   * Start monitoring app state for crash prevention
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    const subscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );

    // Cleanup function
    return () => {
      subscription.remove();
      this.cleanup();
    };
  }

  /**
   * Handle app state changes to prevent crashes
   */
  private handleAppStateChange = (nextAppState: string): void => {

    if (nextAppState === 'active') {
      // App became active - clear any pending timeouts
      this.clearAppStateTimeout();
    } else if (nextAppState === 'background') {
      // App going to background - set a safety timeout
      this.setAppStateTimeout();
    } else if (nextAppState === 'inactive') {
      // App becoming inactive - prepare for potential crash
      this.prepareForInactive();
    }
  };

  /**
   * Set timeout for app state monitoring
   */
  private setAppStateTimeout(): void {
    this.clearAppStateTimeout();

    this.appStateTimeout = setTimeout(() => {

      this.forceCleanup();
    }, 30000); // 30 seconds
  }

  /**
   * Clear app state timeout
   */
  private clearAppStateTimeout(): void {
    if (this.appStateTimeout) {
      clearTimeout(this.appStateTimeout);
      this.appStateTimeout = null;
    }
  }

  /**
   * Prepare app for inactive state
   */
  private prepareForInactive(): void {

    // Clear any pending operations
    this.clearAppStateTimeout();

    // Force garbage collection if available
    if (global.gc) {
      try {
        global.gc();

      } catch (error) {

      }
    }
  }

  /**
   * Force cleanup of resources
   */
  private forceCleanup(): void {

    // Clear timeouts
    this.clearAppStateTimeout();

    // Platform-specific cleanup
    if (Platform.OS === 'android') {
      // Android specific cleanup

    } else if (Platform.OS === 'ios') {
      // iOS specific cleanup

    }
  }

  /**
   * Cleanup all resources
   */
  cleanup(): void {
    this.isMonitoring = false;
    this.clearAppStateTimeout();

  }

  /**
   * Check if monitoring is active
   */
  isActive(): boolean {
    return this.isMonitoring;
  }
}

export default CrashPrevention.getInstance();
