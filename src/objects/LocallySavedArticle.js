import Article from './Article';

export default class LocallySavedArticle extends Article {
  constructor(id, name, price, quantity, category) {
    super(id, name, price, quantity);
    this.category = category;
  }
}