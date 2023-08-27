import ArticlesList from './ArticlesList.logic';
import PantriesList from './PantriesList.logic';
import PantryStore from '../../../../modules/PantryStore';
const pantry = PantryStore.getInstance();

export default class HomeLogic {
  constructor(initialArticlesList, initialPantriesList) {
    this.articlesList = new ArticlesList(initialArticlesList);
    this.pantriesList = new PantriesList(initialPantriesList);
    this.selectedPantry = null;
  }

  async createBatch(pantryId) {
    await pantry.createBatch(pantryId, this.articlesList.list);
    console.log(pantryId);
  }

  static instance = null;

  static getInstance() {
    if (this.instance === null) {
      this.instance = new HomeLogic();
    } 
    return this.instance;
  }

}