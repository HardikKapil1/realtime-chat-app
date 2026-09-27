import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Format timestamp to readable local time e.g. "10:35 AM"
 */
const formatTime = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return '';
  }
};

const MessageBubble = ({ item, currentUsername }) => {
  const isCurrentUser =
    item.username?.trim().toLowerCase() === currentUsername?.trim().toLowerCase();

  return (
    <View
      style={[
        styles.rowContainer,
        isCurrentUser ? styles.rowRight : styles.rowLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.bubbleUser : styles.bubbleOther,
        ]}
      >
        {!isCurrentUser && (
          <Text style={styles.usernameText}>{item.username}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.textUser : styles.textOther,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestampText,
            isCurrentUser ? styles.timeUser : styles.timeOther,
          ]}
        >
          {formatTime(item.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    marginVertical: 4,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 3,
  },
  bubbleOther: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  usernameText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38bdf8',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: '#ffffff',
  },
  textOther: {
    color: '#f8fafc',
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeOther: {
    color: '#94a3b8',
  },
});

export default MessageBubble;
