import ArticleBuilder from '../src/objects/ArticleBuilder';
import Axion from './Axion';
import Storage from './Storage';
import { listPusher } from '../res/utils';
import { ARTICLES_NAMES_LIST } from '../src/constants/storage.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const storage = Storage.getInstance();
const axion = Axion.getInstance();

const PantryStore = {

  async deleteArticleName(name) {
    let namesList = await this.getArticlesNames();
    namesList = namesList.filter((item) => item !== name);
    await this.saveArticlesNamesList(namesList);
    return namesList;
  },

  async getArticlesNames () {
    return await storage.get(ARTICLES_NAMES_LIST) || [];
  },

  async createBatch(batch) {
    await axion.post("/articles/createBatch", batch);
  },

  async saveArticlesNamesList(list) {
    await storage.store(ARTICLES_NAMES_LIST, list);
  },

  async saveArticleNameLocally(articleName) {
    let articlesNamesList = Array.from( await storage.get(ARTICLES_NAMES_LIST));
    const newList = listPusher(articlesNamesList, articleName);
    await storage.store(ARTICLES_NAMES_LIST, newList);
  },

  async getBatches(pantryId) {
    return axion.get(`/articles/getBatches/${pantryId}`) || [];
  },

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
  },

  async createPantry(pantryName) {
    return await axion.post("/articles/createPantry", { pantryName });
  },

  async getArticlesActualList() {
    return (await storage.get("articleActualList")).map(article => ArticleBuilder.createLocalArticle({...article})) || [];
  },

  async setArticlesActualList(list) {
    await storage.store("articleActualList", list);
  },

  async getArticles() {
    let articles = await axion.get("/articles") || [];
    articles = articles.map(article => ArticleBuilder.createArticle({...article}));
    return articles;
  },

  async getBatch(batchId) {
    return await axion.get(`/articles/getBatch/${batchId}`);
  },

  async deleteBatch(batchId) {
    await axion.post(`/articles/deleteBatch`, { batchId });
  },

  async deleteArticle(articleId) {
    await axion.post("/articles/deleteArticle", { articleId });
  }
}

export default PantryStore;