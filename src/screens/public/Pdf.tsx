import { StyleSheet, View, Dimensions } from 'react-native';
import React, { FC } from 'react';
import { PublicStackScreenProps } from '../../types/navigation.types';
import { WebView } from 'react-native-webview';

const PDF: FC<PublicStackScreenProps<'PDF'>> = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://ibank.rayyanbank.com.ng/policy' }}
        startInLoadingState
      />
    </View>
  );
};

export default PDF;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
