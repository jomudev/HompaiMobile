export const ArticlesUtil = {
  calculateTotal(list) {
    if (!list.length) {
      return 0;
    }
    list = list.map(article => article.total);
    return list.reduce((acc, val) => acc + val );
  }
}