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
    <View style={styles.composerWrapper}>
      <View style={styles.inputContainer}>
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
          <Text
            style={[
              styles.sendIcon,
              isSendDisabled ? styles.sendIconDisabled : styles.sendIconActive,
            ]}
          >
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  composerWrapper: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 26,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    minHeight: 52,
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
    width: 40,
    height: 40,
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
  sendIcon: {
    fontSize: 16,
  },
  sendIconActive: {
    color: '#ffffff',
  },
  sendIconDisabled: {
    color: '#475569',
  },
});

export default MessageInput;
