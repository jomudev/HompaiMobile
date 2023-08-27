import List from '../../../interfaces/IList';
import PantryStore from '../../../../modules/PantryStore';
import Storage from '../../../../modules/Storage';
const pantry = PantryStore.getInstance();
const storage = Storage.getInstance();

export default class ArticleList extends List {
  constructor(initialData) {
    super(initialData);
    this.total = initialData ? this.getTotal(initialData) : 0;
    this.init();
  }

  async init() {
    const list = await this.getArticles();
    this.total = this.getTotal(list);
    super.setList = list;
  }

  getTotal(articlesList) {
    let total = articlesList.map((article) => article.price * article.quantity);
    total = total.length && total.reduce((acc, val) => acc + val);
    return total;
  }

  addToTotal(article) {
    this.total += article.price * article.quantity;
  }

  subtractFromTotal(article) {
    this.total -= article.price * article.quantity;
  }

  add(article) {
    if (article.name.trim() === "") {
      return this.list;
    }
    super.add(article);
    this.addToTotal(article);
    this.saveLocal();
    return this.list;
  }

  remove(id) {
    this.subtractFromTotal(this.list.find(article => article.id === id));
    super.remove(id);
    this.saveLocal();
  }

  modify(id, property, value){
    if (typeof value === "string" && value.trim() === "") {
      return null;
    }
    console.log(super.list);
    let article = this.list.find((article) => article.id === id);
    article = {
      ...article,
      [property]: value,
    };
    super.modify(id, article);
    this.saveLocal();
  }

  async getArticles() {
    return await pantry.getArticlesActualList()
  }

  async saveLocal() {
    await storage.store("articleActualList", this.list);
  }

  clear() {
    this.list = [];
    this.total = 0;
  }

}