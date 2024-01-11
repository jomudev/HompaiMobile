const itemAdder = (dic, item) => (dic[item.trim()] = true);

const createObjectFrom = (array) => {
  let dic = {};
  array.forEach((item) => itemAdder(dic, item));
  return dic;
};

const localeSort = (array, local) => {
  return array.sort((a, b) => a.localeCompare(b, local));
}


// A function that push an item into a list, and omit if the item exists.
export const listPusher = function(list, ...args) {
  let dic = createObjectFrom(list);
  args.forEach((item) => itemAdder(dic, item));
  return localeSort(Object.keys(dic), "es");
};

export function groupBy(array = [], property) {
  const reducer = function(groups, item) {
    let title = item[property]
    let group = groups[title] || (groups[title] = { title, data: []});
    group.data.push(item);
    return groups;
  };
  return array.reduce(reducer, {});
}

export function getScrollDirection (e) {
  const { velocity: { x, y } } = e;
  return { 
    vertical: y < 0 ? 'up' : y > 0 ? 'down' : null,
    horizontal: x < 0 ? 'left' : x > 0 ? 'right' : null,
  }
}

export const timeOut = (timeout) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, timeout);
});