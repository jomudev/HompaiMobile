import PantryStore from "../../../../modules/PantryStore";
import List from "../../../interfaces/IList";
const pantry = PantryStore.getInstance();

export default class PantriesList extends List{
  constructor() {
    super();
    this.init();
  }

  async init() {
    super.list = await pantry.getPantries();
    this.notify();
  }

  getPantryId(pantryName) {
    return super.list.find((pantry) => pantry.name === pantryName)?.id;
  }
}