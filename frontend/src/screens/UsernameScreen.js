import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UsernameScreen = ({ onSetUsername }) => {
  const [inputUsername, setInputUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    const trimmed = inputUsername.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your username');
      return;
    }
    setErrorMessage('');
    onSetUsername(trimmed);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.logoIcon}>💬</Text>
          <Text style={styles.title}>RealTime Chat</Text>
          <Text style={styles.subtitle}>
            Connect instantly with your conversation
          </Text>

          <View style={styles.inputCard}>
            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="Enter your username"
              placeholderTextColor="#64748b"
              value={inputUsername}
              onChangeText={(text) => {
                setInputUsername(text);
                if (errorMessage) setErrorMessage('');
              }}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              autoCapitalize="words"
              autoCorrect={false}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Join Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 44,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputCard: {
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: 15,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default UsernameScreen;
