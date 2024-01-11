import { log } from '../../res/Debug';
import Article from './Article';
import LocallySavedArticle from './LocallySavedArticle';

const ArticleBuilder = {
  createArticle ({id, name, price, quantity}) {
    return new Article(id, name, price, quantity)
  },
  
  createLocalArticle ({name, price, quantity, category}) {
    return new LocallySavedArticle(name, price, quantity, category);
  },
};

export default ArticleBuilder;