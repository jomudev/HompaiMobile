import { 
  Layout, SectionsList,
} from '../components/UI';
import {
  ArticlesHeader,
  ArticlesFooter,
  CategoriesList,
  CategoriesCreator,
  HomeFAB,
} from '../components/HomeComponents';
import { useArticles, useCategories } from '../hooks/ArticlesHooks';
import { memo } from 'react';

export default function Home () {
  const {
    articles, 
    total, 
    quantity, 
    addArticle, 
    modifyArticle, 
    removeArticle, 
    clearArticles
  } = useArticles();
  const {
    selectedCategory,
    setSelectedCategory
  } = useCategories();


  return (
    <Layout>
      <HomeFAB clearArticles={clearArticles} >
      <SectionsList 
        sections={[
          <CategoriesCreator 
            category={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            />,
          <ArticlesHeader 
            total={total} 
            quantity={quantity} 
            selectedCategory={selectedCategory} 
            addArticle={(article) => addArticle(article)} 
            />,
          <CategoriesList
            addArticle={addArticle}
            selectedCategory={selectedCategory}
            articles={articles} 
            modifyArticle={modifyArticle} 
            removeArticle={removeArticle} 
            />,
        ]}
      />
      </HomeFAB>
    </Layout>
  );
};

/**
 * <ArticlesList 
            articles={articles} 
            categories={categories}
            onModify={modifyArticle} 
            onInfo={() => Alert.alert("Función no implementada")}
            onDelete={removeArticle}
            />
 */