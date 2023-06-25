import React, { useState, useEffect, memo } from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Text, 
  DataList, 
  Heading, 
  View, 
  SwipeableListItem, 
  PressableLink 
} from '../components/UI';
import PantryStore from '../../modules/PantryStore';
import colors from '../../res/colors';
import screens from '../../res/screens';
const store = PantryStore.getInstance();

export default function Pantry(props) {
  const { id, name } = props.route.params;
  const [state, setState] = useState({
    batches: [],
  });

  useEffect(() => {
    async function fetchData() {
      const batches = await store.getBatches(id) || [];
      setState({batches});
    }
    fetchData();
  }, []);

  return (
    <Layout>
        <Text>Lotes de mi {name}</Text>
        <DataList 
          data={state.batches}
          render={({item, index}) => 
            <BatchListItem 
              data={item} 
              key={item.id} 
              onDelete={() => setState({
                ...state,
                batches: state.batches.filter((batch, batchIndex) => index !== batchIndex),
                })} 
            />}
        />
    </Layout>
  );
}

async function deleteBatch(id) {
  await store.deleteBatch(id);
}

export const BatchListItem = (props) => {
  const { data } = props;
  return (
    <SwipeableListItem
      style={{ height: 100 }}
      containerStyle={{
        height: '100%',
        backgroundColor: colors.secondary,
        padding: 16,
        borderRadius: 16,
      }}
      rightContent={<Text color="white">Eliminar</Text>}
      rightColor={colors.danger}
      rightPress={async () => {
          await deleteBatch(data.id);
          props.onDelete();
        }}
      >
        <PressableLink
          to={{
            screen: screens.BATCH,
            params: data,
          }}
          style={{
            width: '100%',
          }}>
        <View style={{
        }}>
          <Row centered>
            <Col flex={1} >
              <Heading size="xl" bold>{localeDate(data.date).weekday.toUpperCase()} </Heading>
            </Col>
            <Col flex={1} centeredAll>
              <Row centered>
                <Heading centered size="m" bold>Total: {fixed(data.total)}</Heading>
              </Row>
              <Row centered>
                <Heading centered size="s" bold>Artículos: {data.articlesQuantity}</Heading>
              </Row>
              <Row centered>
                <Text centered size="xs">{localeDate(data.date).dateString}</Text>
              </Row>
            </Col>
          </Row>
        </View>
      </PressableLink>
    </SwipeableListItem>
  )  
}