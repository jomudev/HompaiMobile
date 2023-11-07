import { useState, useRef, useEffect } from 'react';
import PantryStore from '../../modules/PantryStore';
import ArticleBuilder from '../objects/ArticleBuilder';
import { log } from '../../res/Debug';
import { Alert } from 'react-native';

const getTotal = (articles) => {
  let newTotal = articles.reduce((acc, article) => acc + article.total , 0);
  return newTotal;
}

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const total = useRef(0);
  const quantity = useRef(0);

  function setArticlesHandler(newArticles) {
    newArticles = newArticles.map(article => ArticleBuilder.createLocalArticle({...article}));
    setTotal(getTotal(newArticles));
    setQuantity(newArticles.length);
    setArticles(newArticles);
  }

  function setTotal(value) {
    total.current = value
  }
 
  function setQuantity(value) {
    quantity.current = value;
  }

  const clearArticlesHandler = () => {
    setArticles([]);
    setTotal(0);
    setQuantity(0);
  }

  function clearArticles() {
    Alert.alert("Limpiar lista", "¿Deseas borrar todos los artículos?", [
      {
        text: "Sí",
        onPress: clearArticlesHandler,
      }, {
        text: "No",
        onPress: () => {},
      }
    ])
  }

  const unshiftArticle = (article) => Array.from([article, ...articles]);

  const addArticle = (article) => {
    const newArticles = unshiftArticle(article);
    setArticles(newArticles);
    setTotal(total.current + article.total);
    setQuantity(quantity.current + 1);
  };

  const modifyArticle = (modifiedArticle) => {
    let newArray = articles.map(article => article.id === modifiedArticle.id ? modifiedArticle : article);
    setArticles(newArray);
    setTotal(getTotal(newArray));
  }

  const removeArticle = (articleToRemove) => {
    let newArray = articles.filter(article => article.id !== articleToRemove.id);
    setArticles(newArray);
    setTotal(total.current - articleToRemove.total);
    setQuantity(quantity.current - 1);
  }

  useEffect(() => {
    PantryStore.getArticlesActualList().then(setArticlesHandler);
  }, []);

  useEffect(() => {
    PantryStore.setArticlesActualList(articles);
  }, [articles]);

  return { 
    articles,
    total: total.current,
    quantity: quantity.current, 
    addArticle, 
    modifyArticle, 
    removeArticle, 
    clearArticles
  };
};

export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  return {
    selectedCategory,
    setSelectedCategory,
  }
}