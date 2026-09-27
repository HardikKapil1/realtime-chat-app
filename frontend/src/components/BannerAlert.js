import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BannerAlert = ({ message, type = 'error', onDismiss }) => {
  if (!message) return null;

  const isWarning = type === 'warning';

  return (
    <View
      style={[
        styles.banner,
        isWarning ? styles.bannerWarning : styles.bannerError,
      ]}
    >
      <Text style={styles.bannerText}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton} activeOpacity={0.7}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  bannerError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderBottomColor: 'rgba(239, 68, 68, 0.3)',
  },
  bannerWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderBottomColor: 'rgba(245, 158, 11, 0.3)',
  },
  bannerText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  dismissButton: {
    marginLeft: 10,
    padding: 2,
  },
  dismissText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BannerAlert;
