import Article from '../src/objects/Article';
import Axion from './Axion';
import Storage from './Storage';
const storage = Storage.getInstance();
const axion = Axion.getInstance();

export default class PantryStore {
  static instance = null;
  static getInstance() {
    if (this.instance === null) {
      this.instance = new PantryStore();
    }
    return this.instance;
  }

  async createBatch(batch) {
    await axion.post("/articles/createBatch", batch);
  }

  async getBatches(pantryId) {
    return axion.get(`/articles/getBatches/${pantryId}`) || [];
  }

  async getPantries() {
    var pantries = [];
    try {
      const newPantries = await axion.get("/articles/pantries");
      storage.store("pantries", pantries);
      if (!newPantries) {
        throw new Error("No se logró conectar al servidor");
      }
      pantries = newPantries;
    } catch(err) {
      console.error(err);
      const newPantries = storage.get("pantries");
      if (newPantries?.length) {
        pantries = newPantries;
      }
    }
    return pantries;
  }

  async createPantry(pantryName) {
    return await axion.post("/articles/createPantry", { pantryName });
  }

  async getArticlesActualList() {
    let articles = await storage.get("articleActualList") || [];
    articles = articles.map(article => new Article(article.id, article.name, article.price, article.quantity));
    return articles;
  }

  async setArticlesActualList(list) {
    await storage.store("articleActualList", list);
  }

  async getArticles() {
    let articles = await axion.get("/articles") || [];
    articles = articles.map(article => new Article(article.id, article.name, article.price, article.quantity));
    return articles;
  }

  async getBatch(batchId) {
    return await axion.get(`/articles/getBatch/${batchId}`);
  }

  async deleteBatch(batchId) {
    await axion.post(`/articles/deleteBatch`, { batchId });
  }

  async deleteArticle(articleId) {
    await axion.post("/articles/deleteArticle", { articleId });
  }
}