import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypingIndicator = ({ typingUsers = [] }) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  let text = '';
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else {
    text = `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dot}>●</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090d16',
  },
  dot: {
    fontSize: 9,
    color: '#38bdf8',
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },
});

export default TypingIndicator;
