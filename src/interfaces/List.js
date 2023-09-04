import Observable from './Observable';

export default class List extends Observable {
  constructor(initialData) {
    super();
    this.list = initialData || [];
    this.lastChange = null;
  }

  notify() {
    super.notify();
  }

  /**
   * @param {Array} list 
   */

  set setList (list) {
    this.list = list;
    this.lastChange = {
      type: "set",
      data: list,
    };
    this.notify();
  }

  add(item) {
    this.list.unshift(item);
    this.lastChange = {
      type: "add",
      data: item,
    };
    this.notify();
  }
  
  modify(id, property, value) {
    const modifiedList = this.list.map((article) => {
      if (article.id === id) {
        article[property] = value;
        this.lastChange = {
          type: "modified",
          data: article,
        };
      }
      return article;
    });
    this.list = modifiedList;
  }

  remove(id) {
    this.list.splice(this.list.indexOf(item => item.id === id));
    this.lastChange = {
      type: "remove",
      data: id,
    };
    this.notify();
  }

  find(id) {
    return this.list.find(item => item.id === id);
  }

  clear() {
    this.list = [];
    this.lastChange = {
      type: "clear",
      data: null,
    };
    this.notify();
  }
}