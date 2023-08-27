import React, { useEffect } from 'react';
import Router from './src/router';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import { requestUserPermission, getFCMToken, notificationListener } from './modules/PushNotificationHelper';

export default function App() {

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    getFCMToken();
  }, []);

  return (
    <SafeAreaProvider>
      <Router/>
    </SafeAreaProvider>
  );
}