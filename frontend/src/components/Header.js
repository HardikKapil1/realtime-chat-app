import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ username, onlineCount, isConnected, onLeave }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.appIcon}>💬</Text>
          <View style={styles.textColumn}>
            <Text style={styles.appTitle}>RealTime Chat</Text>
            <Text style={styles.appSubtitle}>Live conversation</Text>
          </View>
        </View>

        <View style={styles.rightWrapper}>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText} numberOfLines={1}>
              @{username}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={onLeave}
            activeOpacity={0.7}
          >
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
  headerContainer: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  textColumn: {
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '400',
    marginTop: 1,
  },
  rightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 8,
    maxWidth: 110,
    borderWidth: 1,
    borderColor: '#334155',
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  exitButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default Header;
