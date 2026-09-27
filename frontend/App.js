import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UsernameScreen from './src/screens/UsernameScreen';
import ChatScreen from './src/screens/ChatScreen';

LogBox.ignoreLogs(['props.pointerEvents is deprecated. Use style.pointerEvents']);

export default function App() {
  const [username, setUsername] = useState('');

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#090d16" />
        {username ? (
          <ChatScreen username={username} onLeave={() => setUsername('')} />
        ) : (
          <UsernameScreen onSetUsername={(name) => setUsername(name)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
});
