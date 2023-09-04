export default class Article {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = this.initPrice(price);
    this.quantity = this.initQuantity(quantity);
  }

  initPrice(price) {
    price = parseFloat(price);
    if (isNaN(price)) {
      return 0;
    }
    return price;
  }

  initQuantity(quantity) {
    quantity = parseFloat(quantity);
    if (isNaN(quantity) || quantity === 0.00) {
      return 1;
    }
    return quantity;
  }

  get total() {
    return this.price * this.quantity;
  }
}