import messaging from '@react-native-firebase/messaging';
import Storage from './Storage';
const storage = Storage.getInstance();

export async function requestUserPermission() {
  console.log("requesting permissions...");
  const authStatus = await messaging().requestPermission();
  const enabled =
  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function getFCMToken() {
  let fcmToken = await storage.get("fcmToken");
  if (!fcmToken) {
    try {
      let fcmToken = await messaging().getToken();
      if (fcmToken) {
        storage.store("fcmToken", fcmToken);
      }
    } catch(error) {
      console.error("Error in fcmToken", error);
    }
  }
  return fcmToken;
}

export const notificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  // Check whether an initial notification is available
  messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  });

  messaging().onMessage(async remoteMessage => {
    console.log("notification on foreground state...", remoteMessage);
  })
}