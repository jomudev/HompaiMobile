import Observable from '../interfaces/Observable';
import PantryStore from '../../modules/PantryStore';
const pantry = PantryStore.getInstance();

export default class Batch extends Observable {
  constructor(articles, pantry) {
    super();
    this.articles = Array.from(articles || []);
    this.total = this.calculateArticlesTotal(articles);
    this.pantryId = pantry;
    this.change;
  }

  saveLocally() {
    pantry.setArticlesActualList(this.articles);
  }

  setArticles(articles) {
    this.articles = articles;
    this.total = this.calculateArticlesTotal(articles);
    this.change = {
      type: "set",
      data: articles,
    };
    super.notify();
    this.saveLocally();
  }

  /**
   * @param {string} pantry
   */

  set selectedPantry (pantry) {
    this.pantryId = pantry;
    this.change = {
      type: "setPantry",
      data: pantry,
    }
    super.notify();
  }

  calculateArticlesTotal(articles) {
    let totals;
    if (!articles) {
      totals = Array.from(this.articles.map(article => article.total));
    }
    if (articles) {
      totals = Array.from(articles.map(article => article.total));
    }
    return totals.reduce((acc, val) => acc + val, 0);
  }

  onChange(observer) {
    super.addObserver(observer);
    this.change = {
      type: "attachingObserver",
      data: observer,
    }
    super.notify();
  }

  addArticle(article) {
    this.total += article.total;
    this.articles.unshift(article);
    this.change = {
      type: "add",
      data: article,
    };
    super.notify();
    this.saveLocally();
  }

  removeArticle(article) {
    this.total -= article.total;
    const findArticleIndexTestFunction = (testArticle) => testArticle.id === article.id;
    const articleIndex = this.articles.findIndex(findArticleIndexTestFunction);
    console.log(articleIndex);
    this.articles.splice(articleIndex, 1);
    this.change = {
      type: "remove",
      data: article,
    };
    super.notify();
    this.saveLocally();
  }

  modifyArticle(article) {
    const articleIndex = this.articles.findIndex((listArticle) => listArticle.id === article.id);
    this.articles.splice(articleIndex, 1, article);
    this.total = this.calculateArticlesTotal();
    this.change = {
      type: "modify",
      data: article,
    }
    super.notify();
    this.saveLocally();
  }

  clear() {
    this.articles = [];
    this.total = 0;
    this.change = {
      type: "clear",
      data: null,
    };
    super.notify();
  }

  async save() {
    if (!this.pantriId || this.articles.length === 0) {
      return;
    }
    await pantry.createBatch({articles: this.articles, pantryId: this.pantryId, total: this.total});
    this.clear();
  }
}