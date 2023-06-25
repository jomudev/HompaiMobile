import { registerRootComponent } from 'expo';
const env = process.env;
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId: env.FB_WEB_CLIENT_ID || "926926409859-spfdfdqoarff6itj9lqau5uqj4h8orte.apps.googleusercontent.com",
  offlineAccess: false,
});

window.fixed = (value) => isNaN(value) ? "0.00" : parseFloat(value).toFixed(2);
window.localeDate = (date) => {
  date = new Date(date);
  const lang = 'es-ES';
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }

  return {
    dateString: date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
    weekday: date.toLocaleDateString(lang, {
      weekday: 'long'
    }),
  }
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
