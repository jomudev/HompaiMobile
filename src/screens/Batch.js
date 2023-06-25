import React, { useEffect, useState } from 'react';
import { Layout, Text, Heading, View, Container, DataList } from '../components/UI';
import PantryStore from '../../modules/PantryStore';
import { DynamicArticlesListItem } from '../components/HomeComponents';
import { StaticArticleListItem } from './Articles';
const pantryStore = PantryStore.getInstance();

export default function BatchScreen(props) {
  const [state, setState] = useState({
    batch: props.route.params,
    articles: [],
  });
  useEffect(() => {
    async function fetchData() {
      const batch = await pantryStore.getBatch(props.route.params.id);
      setState(batch)
    }
    fetchData();
  }, []);

  const batch = state.batch;

  return (
    <Layout>
      <Container>
        <Heading size="xl" bold>
          Lote del {localeDate(batch.date).dateString}
        </Heading>
        <DataList 
          data={state.articles}
          render={({item}) => {
            console.log(item);
            return <StaticArticleListItem article={item} />
          }}
        />
      </Container>
    </Layout>
  );
}
