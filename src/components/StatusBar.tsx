import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import { STATUSBAR_HEIGHT } from '../util/height';

export default function MyStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
