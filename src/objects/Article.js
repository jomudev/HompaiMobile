export default class Article {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = 1;
  }

  get total() {
    return this.price * this.quantity;
  }
}