const baseAPIurl = "https://localhost:5000";

class Database {

  static userId;

  static async f(path, options) {
    return await fetch(baseAPIurl + path, options);
  }

  static async getAllUsers() {
    return (await fetch('http://192.168.0.23:5000/auth/all_users')).json()
  }

  static async createUser(user) {
    user = {
        email: user.email,
        photoURL: user.photoURL,
        id: user.uid,
        phoneNumber: user.phoneNumber,
      } 
    const res = (await this.f("/auth/create_user", {
      method: 'post',
      body: user,
    })).json();
    console.log(res);
    return res;
  }
}

export default Database;