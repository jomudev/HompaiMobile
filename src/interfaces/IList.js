import Observable from './Observable';

export default class List extends Observable {
  constructor(initialData) {
    super();
    this.list = initialData || [];
    this.lastChange = null;
  }

  /**
   * @param {Array} list 
   */

  set setList (list) {
    this.list = list;
    this.lastChange = {
      type: "set",
      data: null,
    };
    super.notify();
  }

  add(item) {
    this.list.push(item);
    this.lastChange = {
      type: "add",
      data: item,
    };
    super.notify();
  }
  
  modify(id, modifiedItem) {
    this.list = this.list.map((item) => item.id === id ? modifiedItem : item);
    this.lastChange = {
      type: "modified",
      data: modifiedItem,
    };
    super.notify();
  }

  remove(id) {
    this.list.splice(this.list.indexOf(item => item.id === id));
    this.lastChange = {
      type: "remove",
      data: id,
    };
    super.notify();
  }

  find(id) {
    return this.list.find(item => item.id === id);
  }
}