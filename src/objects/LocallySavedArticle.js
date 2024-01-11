import Article from './Article';

export default class LocallySavedArticle extends Article {
  constructor(name, price, quantity, category) {
    super(name, price, quantity);
    this.category = category;
  }
}