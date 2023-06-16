class PantryStore {
  static instance = null;
  static getInstance() {
    if (this.instance === null) {
      this.instance = new PantryStore();
    }
    return this.instance;
  }
}