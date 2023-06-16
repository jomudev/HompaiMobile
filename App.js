import React from 'react';
import Router from './src/router';
import { SafeAreaProvider} from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <Router/>
    </SafeAreaProvider>
  );
}