import { registerRootComponent } from 'expo';
import App from './App';

const lang = "es-HN"

globalThis.currency = (value) => parseFloat(value).toLocaleString(lang, { style: 'currency', currency: 'HNL'});
globalThis.quantify = (value) => parseFloat(value, 10).toLocaleString();
window.localeDate = (date) => {
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
      weekday: 'short'
    }),
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
