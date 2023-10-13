import Article from './Article';
import LocallySavedArticle from './LocallySavedArticle';

export default class ArticleBuilder {
  static createArticle (id, name, price, quantity) {
    return new Article(id, name, price, quantity)
  }
  
  static createLocalArticle (id, name, price, quantity, category) {
    return new LocallySavedArticle(id, name, price, quantity, category);
  }
}