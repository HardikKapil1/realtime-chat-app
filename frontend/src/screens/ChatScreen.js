import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import MessageInput from '../components/MessageInput';
import BannerAlert from '../components/BannerAlert';
import { fetchMessages } from '../services/apiService';
import {
  connectSocket,
  disconnectSocket,
} from '../services/socketService';

const ChatScreen = ({ username, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');

  const flatListRef = useRef(null);

  const scrollToBottom = (animated = true) => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 100);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialMessages = async () => {
      try {
        setLoading(true);
        const history = await fetchMessages();
        if (isMounted) {
          setMessages(history);
          setLoading(false);
          scrollToBottom(false);
        }
      } catch (err) {
        console.error('[ChatScreen] Error loading message history:', err.message);
        if (isMounted) {
          setLoading(false);
          showAlert(err.message || 'Could not load message history from server.');
        }
      }
    };

    loadInitialMessages();

    const socket = connectSocket(username);
    setIsConnected(socket.connected);

    const handleConnect = () => {
      setIsConnected(true);
      setAlertMessage('');
      socket.emit('join_chat', { username });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      showAlert('Disconnected from real-time server. Attempting reconnect...', 'warning');
    };

    const handleConnectError = (err) => {
      console.error('[ChatScreen] Socket connect_error:', err.message);
      setIsConnected(false);
      showAlert('Server connection failed. Please check network host.', 'error');
    };

    const handleUsersOnline = (usersList) => {
      if (isMounted) {
        setOnlineUsers(usersList || []);
      }
    };

    const handleNewMessage = (newMessage) => {
      if (isMounted) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        scrollToBottom(true);
      }
    };

    const handleUserTyping = ({ username: typingUser }) => {
      if (isMounted && typingUser && typingUser !== username) {
        setTypingUsers((prev) => {
          if (!prev.includes(typingUser)) {
            return [...prev, typingUser];
          }
          return prev;
        });
      }
    };

    const handleUserStopTyping = ({ username: stoppedUser }) => {
      if (isMounted && stoppedUser) {
        setTypingUsers((prev) => prev.filter((u) => u !== stoppedUser));
      }
    };

    const handleMessageError = ({ message: errorMsg }) => {
      if (isMounted) {
        showAlert(errorMsg || 'Failed to send message.', 'error');
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('users_online', handleUsersOnline);
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('message_error', handleMessageError);

    return () => {
      isMounted = false;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('users_online', handleUsersOnline);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
      socket.off('message_error', handleMessageError);
      disconnectSocket();
    };
  }, [username]);

  const showAlert = (msg, type = 'error') => {
    setAlertMessage(msg);
    setAlertType(type);
  };

  const handleLeaveChat = () => {
    disconnectSocket();
    onLeave();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Header
          username={username}
          onlineCount={onlineUsers.length}
          isConnected={isConnected}
          onLeave={handleLeaveChat}
        />

        <BannerAlert
          message={alertMessage}
          type={alertType}
          onDismiss={() => setAlertMessage('')}
        />

        <View style={styles.messagesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              style={styles.flatList}
              data={messages}
              keyExtractor={(item, index) => item._id || index.toString()}
              renderItem={({ item, index }) => {
                const isConsecutive =
                  index > 0 && messages[index - 1]?.username === item.username;
                return (
                  <MessageBubble
                    item={item}
                    currentUsername={username}
                    isConsecutive={isConsecutive}
                  />
                );
              }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => scrollToBottom(true)}
              onLayout={() => scrollToBottom(false)}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>💬</Text>
                  <Text style={styles.emptyTitle}>No messages yet</Text>
                  <Text style={styles.emptySubtitle}>Start the conversation!</Text>
                </View>
              }
            />
          )}

          <TypingIndicator typingUsers={typingUsers} />
        </View>

        <MessageInput username={username} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  flatList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '400',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default ChatScreen;
