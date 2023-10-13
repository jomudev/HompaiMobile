

export default class ArticlesCategory {
  constructor(name, articles) {
    this.name = name;
    this.articles = Array.from(articles || []);
    this.total = this.calculateArticlesTotal(articles);
  }

  setArticles(articles) {
    this.articles = articles;
    this.total = this.calculateArticlesTotal(articles);
  }

  /**
   * @param {string} pantry
   */

  set selectedPantry (pantry) {
    this.pantryId = pantry;
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
  }

  addArticle(article) {
    this.total += article.total;
    this.articles.unshift(article);
  }

  removeArticle(article) {
    this.total -= article.total;
    const findArticleIndexTestFunction = (testArticle) => testArticle.id === article.id;
    const articleIndex = this.articles.findIndex(findArticleIndexTestFunction);
    console.log(articleIndex);
    this.articles.splice(articleIndex, 1);
  }

  modifyArticle(article) {
    const articleIndex = this.articles.findIndex((listArticle) => listArticle.id === article.id);
    this.articles.splice(articleIndex, 1, article);
    this.total = this.calculateArticlesTotal();
  }

  clear() {
    this.articles = [];
    this.total = 0;
  }

  async save() {
    if (!this.pantriId || this.articles.length === 0) {
      return;
    }
    await pantry.createBatch({articles: this.articles, pantryId: this.pantryId, total: this.total});
    this.clear();
  }
}