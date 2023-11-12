import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from '../res/Debug';

class Storage {
    static instance = null;

    static getInstance () {
      if (this.instance === null) {
        this.instance = new Storage();
      }
      return this.instance;
    }

    async store (key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            log(err);
            return false;
        }
    }

    async get (key) {
        try {
            const item = await AsyncStorage.getItem(key);
            return JSON.parse(item);
        } catch (err) {

            console.log("Storage get error", err);

            throw Error(err);

        }
    }

    multiGet = async (keys) => {
        try {

            return await AsyncStorage.multiGet(keys);

        } catch (err) {

            console.log("Storage multiGet error", err);

            throw Error(err);
        }
    }

    getAllKeys = async () => {
        try {
            
            return await AsyncStorage.getAllKeys().then((keys) => {
                return keys.filter((key) => key.includes("prollar-"));
            });

        } catch(err) {

            console.log("Storage getAllKeys error", err);

            throw Error(err);

        }
    }

    remove = async (key) => {
        try {

            await AsyncStorage.removeItem(key);

            return true;

        } catch (err) {

            console.log("Storage remove error", err);

            return false;
        }
    }
}

export default Storage;