import { AINetworkError } from "../src/errors/AIErrors";

const AI_API_URL = process.env.AI_API_URL || "http://192.168.0.17:3000/hompai/recomendation";

export const AIListForRecipe = (list) => {
  return `/${list.map((item, index) => `${index + 1}. ${item.name} `)}`;
};

const AIapi = {
  makeRequest: async (path, options) => {
    try {
      return await fetch(AI_API_URL + path, options).then(async (res) => await res.json());
    } catch(err) {
      throw new AINetworkError();
    }
  },

  async getRecipe (list) {
    if (!list.length) {
      return;
    }
    return await this.makeRequest(AIListForRecipe(list));
  },
};

export default AIapi;