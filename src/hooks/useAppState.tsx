import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.match(/active|inactive/) &&
          nextAppState === 'background'
        ) {

          // Logout user on app exit (except when using Back button)
        }
        setAppState(nextAppState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return appState;
};

export default useAppState;
