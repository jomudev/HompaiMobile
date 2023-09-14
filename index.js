import { registerRootComponent } from 'expo';
import App from './App';

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
      weekday: 'short'
    }),
  }
}


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
