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
  }, [props.route.params.id]);

  const batch = state.batch;

  return (
    <Layout>
      <Heading size="l" bold>
        Lote del {localeDate(batch.date).dateString}
      </Heading>
      <DataList 
        data={state.articles}
        render={({item}) => {
          console.log(item);
          return (
            <View>
              { 
                /**
                item.expirationDate && <Text size="s" muted>Cad:{localeDate(item.expirationDate).dateString}</Text> 
                **/
              }
              <Text>
                <Heading size="m" bold >{item.quantity} {item?.measure ? item.measure : null}de {item.name} </Heading>
                <Text >💵{fixed(item.price)} </Text>
                <Text bold>💰{fixed(item.price * item.quantity)}</Text>
              </Text>
            </View> 
            )
        }}
      />
    </Layout>
  );
}
