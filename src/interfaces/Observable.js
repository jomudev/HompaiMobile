export default class Observable {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    let observerIndex = 0;
    this.observers.push(observer);
    observerIndex = this.observers.length - 1;
    this.notify();
    return () => {
      this.observers.splice(observerIndex, 1);
    }
  }

  notify() {
    this.observers.forEach((observer) => observer());
  }
}