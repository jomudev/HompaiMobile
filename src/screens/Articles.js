import React, { useEffect, useState } from 'react';
import { DataList, Heading, Layout, Text, Col, SwipeableListItem} from '../components/UI';
import PantryStore from '../../modules/PantryStore';
import { ArticleRow, ArticleView } from '../components/HomeComponents';
import colors from '../../res/colors';
const pantry = PantryStore.getInstance();

export const StaticArticleListItem = ({article}) => {
  return (
    <ArticleRow style={{gap: 16}}>
      <Col flex={2}>
        <Text centered>{article.name}</Text>
      </Col>
      <Col flex={1}>
        <ArticleView>
          <Text>{fixed(article.price)}</Text>
        </ArticleView> 
      </Col>
      <Col flex={1}>
        <ArticleView>
          <Text>{article.quantity}</Text>
        </ArticleView>
      </Col>
    </ArticleRow>
  );
}

/**
 * Functions
 */

function deleteArticle(id, list) {
  pantry.deleteArticle(id);
  return list.filter((item) => item.id !== id);
}

//

export default function Articles(props) {
  const [state, setState] = useState({
    articles: [],
  });

  useEffect(() => {
    async function fetchArticles() {
      const articles = await pantry.getArticles();
      setState({ articles });
    }
    fetchArticles();
  }, []);

  return(
    <Layout>
      <Heading size="xl">Artículos</Heading>
      <DataList 
        data={state.articles}
        render={({item}) => (
          <SwipeableListItem
            style={{ height: 40 }}
            rightContent={() => <Text color="white">eliminar</Text>}
            rightColor={colors.danger}
            rightPress={() => setState({
              articles: deleteArticle(item.id, state.articles),
            })}
          >
            <StaticArticleListItem article={{name: item.name, price: item.initialPrice, quantity: item?.quantity}} />
          </SwipeableListItem>)}
      />
    </Layout>
  )
}