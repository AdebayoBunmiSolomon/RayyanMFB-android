import { useEffect, useRef, useCallback } from 'react';
import { InteractionManager, Platform } from 'react-native';

/**
 * Performance Monitoring Hook
 * Tracks component performance and prevents memory leaks
 */

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  interactionTime?: number;
}

export const usePerformanceMonitor = (
  componentName: string,
  options: {
    trackRenderTime?: boolean;
    trackMemory?: boolean;
    trackInteractions?: boolean;
    warnThreshold?: number; // ms
  } = {},
) => {
  const {
    trackRenderTime = true,
    trackMemory = false,
    trackInteractions = false,
    warnThreshold = 100, // 100ms default
  } = options;

  const renderStartTime = useRef<number>(0);
  const interactionStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({ renderTime: 0 });

  // Track render performance
  useEffect(() => {
    if (trackRenderTime) {
      renderStartTime.current = performance.now();

      return () => {
        const renderTime = performance.now() - renderStartTime.current;
        metrics.current.renderTime = renderTime;

        if (renderTime > warnThreshold) {
          console.warn(
            `[Performance] ${componentName} took ${renderTime.toFixed(
              2,
            )}ms to render (threshold: ${warnThreshold}ms)`,
          );
        }
      };
    }
  }, [componentName, trackRenderTime, warnThreshold]);

  // Track memory usage (Android only)
  useEffect(() => {
    if (trackMemory && Platform.OS === 'android') {
      const checkMemory = () => {
        try {
          // @ts-ignore - Android specific API
          if (global.performance && global.performance.memory) {
            const memory = global.performance.memory;
            const usedMB = memory.usedJSHeapSize / 1024 / 1024;
            const totalMB = memory.totalJSHeapSize / 1024 / 1024;

            metrics.current.memoryUsage = usedMB;

            if (usedMB > 100) {
              // Warn if using more than 100MB
              console.warn(
                `[Memory] ${componentName} using ${usedMB.toFixed(
                  2,
                )}MB of ${totalMB.toFixed(2)}MB`,
              );
            }
          }
        } catch (error) {
          // Memory API not available
        }
      };

      const interval = setInterval(checkMemory, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [componentName, trackMemory]);

  // Track interaction performance
  const trackInteraction = useCallback(
    (interactionName: string) => {
      if (trackInteractions) {
        interactionStartTime.current = performance.now();

        return () => {
          const interactionTime =
            performance.now() - interactionStartTime.current;
          metrics.current.interactionTime = interactionTime;

          if (interactionTime > warnThreshold) {
            console.warn(
              `[Interaction] ${componentName}.${interactionName} took ${interactionTime.toFixed(
                2,
              )}ms (threshold: ${warnThreshold}ms)`,
            );
          }
        };
      }
      return () => {};
    },
    [componentName, trackInteractions, warnThreshold],
  );

  // Get current metrics
  const getMetrics = useCallback(() => {
    return { ...metrics.current };
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metrics.current = { renderTime: 0 };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Log final metrics
      if (__DEV__) {

      }
    };
  }, [componentName]);

  return {
    trackInteraction,
    getMetrics,
    resetMetrics,
  };
};
