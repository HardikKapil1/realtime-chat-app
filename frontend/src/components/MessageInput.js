import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { emitSendMessage, emitTyping, emitStopTyping } from '../services/socketService';

const MessageInput = ({ username }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (newText) => {
    setText(newText);

    if (username) {
      emitTyping(username);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(username);
      }, 2000);
    }
  };

  const handleSend = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitStopTyping(username);

    emitSendMessage(username, trimmedText);
    setText('');
  };

  const isSendDisabled = !text.trim();

  return (
    <View style={styles.composerContainer}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#64748b"
        value={text}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        blurOnSubmit={false}
        multiline={false}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          isSendDisabled ? styles.sendButtonDisabled : styles.sendButtonActive,
        ]}
        onPress={handleSend}
        disabled={isSendDisabled}
        activeOpacity={0.8}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    fontSize: 15,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#6366f1',
  },
  sendButtonDisabled: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MessageInput;
