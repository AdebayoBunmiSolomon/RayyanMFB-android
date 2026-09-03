import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Performance optimization utilities for React Native components
 */

/**
 * Creates a memoized callback that only changes when dependencies change
 * Useful for event handlers and functions passed to child components
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
): T => {
  return useCallback(callback, deps);
};

/**
 * Creates a memoized value that only recalculates when dependencies change
 * Useful for expensive calculations and object/array creation
 */
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
): T => {
  return useMemo(factory, deps);
};

/**
 * Debounce utility for search inputs and API calls
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle utility for scroll events and frequent updates
 */
export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

/**
 * Optimized style creation that only recreates when theme changes
 */
export const useOptimizedStyles = <T>(
  styleFactory: () => T,
  deps: React.DependencyList,
): T => {
  return useMemo(styleFactory, deps);
};

/**
 * Prevents unnecessary re-renders by shallow comparing props
 */
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
};

/**
 * Creates a stable reference for objects that don't change often
 */
export const useStableObject = <T extends Record<string, any>>(
  obj: T,
  deps: React.DependencyList,
): T => {
  return useMemo(() => obj, deps);
};

/**
 * Creates a stable reference for arrays that don't change often
 */
export const useStableArray = <T>(
  arr: T[],
  deps: React.DependencyList,
): T[] => {
  return useMemo(() => arr, deps);
};

/**
 * Performance monitoring hook for development
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;

    if (__DEV__) {

    }

    startTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
    logRender: () => {
      if (__DEV__) {

      }
    },
  };
};
