import Auth from './Auth';
import { ToastAndroid } from 'react-native';
const auth = Auth.getInstance();
export default class Axion {
  constructor() {
    this.baseURL = "http://192.168.0.12:5000";
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': auth.currentUser.uid,
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
      ToastAndroid.show(err.message, ToastAndroid.LONG);
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