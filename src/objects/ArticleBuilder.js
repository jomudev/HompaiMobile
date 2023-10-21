import { log } from '../../res/Debug';
import Article from './Article';
import LocallySavedArticle from './LocallySavedArticle';

const ArticleBuilder = {
  createArticle ({id, name, price, quantity}) {
    return new Article(id, name, price, quantity)
  },
  
  createLocalArticle ({id, name, price, quantity, category}) {
    return new LocallySavedArticle(id, name, price, quantity, category);
  },
};

export default ArticleBuilder;