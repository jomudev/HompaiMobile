export default class Article {
  constructor(name, price, quantity) {
    this.id = Math.random().toString(12).substring(0);
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