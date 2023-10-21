import ArticleBuilder from '../src/objects/ArticleBuilder';
import Axion from './Axion';
import Storage from './Storage';
const storage = Storage.getInstance();
const axion = Axion.getInstance();

export default class PantryStore {

  static async createBatch(batch) {
    await axion.post("/articles/createBatch", batch);
  }

  static async getBatches(pantryId) {
    return axion.get(`/articles/getBatches/${pantryId}`) || [];
  }

  static async getPantries() {
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

  static async createPantry(pantryName) {
    return await axion.post("/articles/createPantry", { pantryName });
  }

  static async getArticlesActualList() {
    return (await storage.get("articleActualList")).map(article => ArticleBuilder.createLocalArticle({...article})) || [];
  }

  static async setArticlesActualList(list) {
    await storage.store("articleActualList", list);
  }

  static async getArticles() {
    let articles = await axion.get("/articles") || [];
    articles = articles.map(article => ArticleBuilder.createArticle({...article}));
    return articles;
  }

  static async getBatch(batchId) {
    return await axion.get(`/articles/getBatch/${batchId}`);
  }

  static async deleteBatch(batchId) {
    await axion.post(`/articles/deleteBatch`, { batchId });
  }

  static async deleteArticle(articleId) {
    await axion.post("/articles/deleteArticle", { articleId });
  }
}