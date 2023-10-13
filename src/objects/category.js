export default class Category {
  constructor(name, articles) {
    this.name = name || "🤷‍♂️";
    this.articles = [];
    this.total = 0;
  }

  calculateTotal() {
    const totals = this.articles.map(article => article.total);
    this.total = totals.reduce((acc, dev) => acc + dev, 0);
  }

  add(article) {
    this.articles.push(article); 
    this.total += article.total;
  }

  findIndex(id) {
    return this.articles.indexOf(article => article.id === id);
  }

  remove(article) {
    const index = this.findIndex(article.id)
    this.articles.splice(index);
    this.total -= article.total;
  }

  modify(modifiedArticle) {
    const index = this.findIndex(modifiedArticle.id);
    this.articles.splice(index, 1, modifiedArticle);
    this.calculateTotal();
  }
}