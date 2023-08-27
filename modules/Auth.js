import Auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default class AppAuth {

  static instance = null;

  static getInstance() {
    if (this.instance === null) {
      this.instance = new AppAuth();
    }
    return this.instance;
  }
  
  async signInWithGoogle () {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    } catch (err) {
      console.error(err);
      throw new Error("Servicios de Google Play no disponibles");
    }
    var token;
    try {
      let { idToken } = await GoogleSignin.signIn();
      token = idToken;
    } catch (err) {
      console.error(err);
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error("Has cancelado el inicio de sesión");
        return;
      }
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Los servicios de google play no están disponibles.");
        return;
      }
    }
    try {
      const googleCredential = Auth.GoogleAuthProvider.credential(token);
      return Auth().signInWithCredential(googleCredential);
    } catch(err) {
      console.error(err);
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