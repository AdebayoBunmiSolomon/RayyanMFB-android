import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const KeyboardAvoidWrapper: React.FC<IProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ ...styles.container }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
