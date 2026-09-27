import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Format ISO timestamp to readable 12-hour local time e.g. "2:52 PM"
 */
const formatTime = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return '';
  }
};

const MessageBubble = ({ item, currentUsername, isConsecutive = false }) => {
  const isCurrentUser =
    item.username?.trim().toLowerCase() === currentUsername?.trim().toLowerCase();

  return (
    <View
      style={[
        styles.rowContainer,
        isCurrentUser ? styles.rowRight : styles.rowLeft,
        isConsecutive ? styles.rowConsecutive : styles.rowNormal,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.bubbleUser : styles.bubbleOther,
        ]}
      >
        {!isCurrentUser && !isConsecutive && (
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
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  rowNormal: {
    marginTop: 8,
  },
  rowConsecutive: {
    marginTop: 3,
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  usernameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  textUser: {
    color: '#ffffff',
  },
  textOther: {
    color: '#f8fafc',
  },
  timestampText: {
    fontSize: 11,
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
