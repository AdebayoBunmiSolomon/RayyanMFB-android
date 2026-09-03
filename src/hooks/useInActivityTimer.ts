import { useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useInactivityTimer = (
  timeoutMs: number,
  onTimeout: () => void,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backgroundedAtRef = useRef<number | null>(null);

  // keep the latest callback in a ref so it doesn't force the
  // mount effect below to re-subscribe on every render
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number) => {
      clearTimer();
      timerRef.current = setTimeout(() => onTimeoutRef.current(), duration);
    },
    [clearTimer],
  );

  const resetTimer = useCallback(() => {
    startTimer(timeoutMs);
  }, [startTimer, timeoutMs]);

  useEffect(() => {
    resetTimer(); // start fresh on mount

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        if (backgroundedAtRef.current != null) {
          const elapsed = Date.now() - backgroundedAtRef.current;
          backgroundedAtRef.current = null;

          if (elapsed >= timeoutMs) {
            // already past the timeout while away — kick immediately
            clearTimer();
            onTimeoutRef.current();
            return;
          }
          // resume the countdown with only what's left
          startTimer(timeoutMs - elapsed);
        } else {
          resetTimer();
        }
      } else {
        // going to background/inactive — stamp the time, stop the JS timer
        if (backgroundedAtRef.current == null) {
          backgroundedAtRef.current = Date.now();
        }
        clearTimer();
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      sub.remove();
      clearTimer();
    };
    // intentionally only re-run if timeoutMs changes — not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutMs]);

  return resetTimer;
};
