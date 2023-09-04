import { 
  Layout, SectionsList,
} from '../components/UI';
import {
  ArticlesHeader,
  ArticlesList,
  ArticlesFooter,
} from '../components/HomeComponents';
import {useState, useCallback, useEffect} from 'react';
import { Alert, View as RNView } from 'react-native'
import PantryStore from '../../modules/PantryStore';
import Batch from '../objects/Batch';
const pantry = PantryStore.getInstance();

const batch = new Batch();
export default function Home () {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const getActualList = useCallback(async () => {
    const list = await pantry.getArticlesActualList();
    batch.setArticles(list);
  }, []);

  const submit = useCallback(async () => {
    await batch.save();
  }, [batch]);


  useEffect(() => {
    getActualList();
    const unsubscribe = batch.onChange((data) => {
      const newArticles = Array.from(data.articles);
      setArticles(newArticles);
      setTotal(data.total);
      setQuantity(data.articles.length);
    });
    return unsubscribe;
  }, []);

  return (
    <Layout>
      <SectionsList 
        sections={[
          <ArticlesHeader 
            total={total}
            quantity={quantity}
            onAddArticle={(article) => batch.addArticle(article)}
            onSelectPantry={(pantry) => batch.selectedPantry = pantry }
            onLoadPantries={(pantries) => batch.selectedPantry = pantries[0].name}
            />,
          <ArticlesList 
            articles={articles} 
            onModify={(data) => batch.modifyArticle(data)} 
            onInfo={(data) => Alert.alert("Función no implementada")}
            onDelete={(data) => batch.removeArticle(data)}
            />,
          <ArticlesFooter onSubmit={submit} clearList={() => batch.clear()} />,
        ]}
      />
    </Layout>
  );
};