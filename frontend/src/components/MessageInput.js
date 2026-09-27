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
      <View style={styles.inputRow}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  composerContainer: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    minHeight: 56,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  sendButtonActive: {
    backgroundColor: '#6366f1',
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default MessageInput;
