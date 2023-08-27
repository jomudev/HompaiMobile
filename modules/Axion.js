import Auth from './Auth';
import { ToastAndroid } from 'react-native';
import { getFCMToken } from './PushNotificationHelper';

const auth = Auth.getInstance();
const host = {
  local: "http://localhost:5000",
  remote: "http://34.228.161.122:8080",
}
export default class Axion {
  constructor() {
    this.baseURL = host.remote;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': auth.currentUser?.uid,
    };
    this.setFCMTokenHeader();
  }

  async setFCMTokenHeader() {
    const token = await getFCMToken()
    this.headers = {
      ...this.headers,
      'Messaging-Token': token,
    };
  }

  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Axion();
    }
    return this.instance;
  }

  async f (path, options) {
    try {
      let res = await fetch(this.baseURL + path, { 
        headers: {
          ...this.headers,
          ...options.headers,
        }, 
        ...options,
        body: JSON.stringify(options.body)
      });
      res = await res.json();
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data;
    } catch (err) {
      if (err.message === "Network request failed") {
        ToastAndroid.show("Error de conexión", ToastAndroid.LONG);
      }
      console.error(err);
      return null;
    }
  }

  async get (path, data) {
    return await this.f(path, {method: "GET", body: data});
  }

  async post (path, data) {
    await this.f(path, {method: "POST", body: data});
  }

  async update (path, data) {
    return await this.f(path, {method: "UPDATE", body: data});
  }
}