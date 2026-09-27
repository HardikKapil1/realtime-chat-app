import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ username, onlineCount, isConnected, onLeave }) => {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.logoIcon}>💬</Text>
          <View>
            <Text style={styles.appName}>RealTime Chat</Text>
            <Text style={styles.appSubtitle}>Live conversation</Text>
          </View>
        </View>

        <View style={styles.rightGroup}>
          <View style={styles.userTag}>
            <Text style={styles.userTagText} numberOfLines={1}>
              @{username}
            </Text>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={onLeave} activeOpacity={0.7}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isConnected ? '#10b981' : '#ef4444' },
          ]}
        />
        <Text style={styles.statusText}>
          {isConnected ? `${onlineCount} online` : 'Connecting...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  appName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '400',
    marginTop: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    maxWidth: 110,
    borderWidth: 1,
    borderColor: '#334155',
  },
  userTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  exitButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default Header;
