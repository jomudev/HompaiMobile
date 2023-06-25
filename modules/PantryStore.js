import Axion from './Axion';
const axion = Axion.getInstance();
export default class PantryStore {
  static instance = null;
  static getInstance() {
    if (this.instance === null) {
      this.instance = new PantryStore();
    }
    return this.instance;
  }

  async createBatch(pantryId, articles) {
    await axion.post("/articles/createBatch", { pantryId, articles });
  }

  async getBatches(pantryId) {
    return axion.get(`/articles/getBatches/${pantryId}`) || [];
  }

  async getPantries() {
    return await axion.get("/articles/pantries") || [];
  }

  async createPantry(pantryName) {
    await axion.post("/articles/createPantry", { pantryName });
  }

  async getArticles() {
    return await axion.get("/articles") || [];
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