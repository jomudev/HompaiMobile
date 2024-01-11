import { 
  Layout
} from '../components/UI';
import {
  ArticlesHeader,
  CategoriesList,
  CategoriesCreator,
} from '../components/HomeComponents';
import { useArticles, useCategories } from '../hooks/ArticlesHooks';
import { useRef } from 'react';
import { REMINDERS } from '../constants/screens';

export default function Home ({ navigation }) {
  const {
    articles, 
    total, 
    quantity, 
    addArticle, 
    modifyArticle, 
    removeArticle, 
    clearArticles
  } = useArticles();

  const selectedCategory = useRef("");
  const setSelectedCategory = (value) => selectedCategory.current = value;
  return (
    <Layout>
      <ArticlesHeader 
        total={total} 
        quantity={quantity} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        addArticle={addArticle} 
        />
      <CategoriesList
          addArticle={addArticle}
          selectedCategory={selectedCategory}
          articles={articles}
          navTo={(screen) => navigation.navigate(REMINDERS)}
          clearArticles={clearArticles}
          modifyArticle={modifyArticle} 
          removeArticle={removeArticle} 
          />
    </Layout>
  );
};