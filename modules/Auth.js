import Auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { ToastAndroid } from 'react-native';

export default class AppAuth {

  static instance = null;

  static getInstance() {
    if (this.instance === null) {
      this.instance = new AppAuth();
    }
    return this.instance;
  }
  
  async signInWithGoogle () {
    const hasPlayServices = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    if (!hasPlayServices) {
      throw new Error("Los servicios de Google Play no están disponibles");
    }

    var token;
    let { idToken } = await GoogleSignin.signIn();
    token = idToken;

    if (!token) {
      throw new Error("No existe un token válido para esta sesión");
    }

    const googleCredential = Auth.GoogleAuthProvider.credential(token);
    if (!googleCredential) {
      throw new Error("No existen credenciales validas para esta sesion");
    }

    console.log(`
      PlayServices Available: ${hasPlayServices},
      Token: ${token},
      Credentials: ${JSON.stringify(googleCredential)},
    `);
    
    try {
      return Auth().signInWithCredential(googleCredential);
    } catch(err) {
      ToastAndroid.show(err, ToastAndroid.LONG);
    }
  }

  get currentUser() {
    return Auth().currentUser;
  }

  signOut() {
    try {
      Auth().signOut();
    } catch(err) {  
      console.error(err);
    }
  }

  onAuthStateChanged(callback) {
    return Auth().onAuthStateChanged(callback);
  }
};