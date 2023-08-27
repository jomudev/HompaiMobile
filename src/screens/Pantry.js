import React, { useState, useEffect, memo } from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Text,
  Heading, 
  View, 
  SwipeableListItem, 
  PressableLink 
} from '../components/UI';
import PantryStore from '../../modules/PantryStore';
import colors from '../../res/colors';
import screens from '../../res/screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import sizes from '../../res/sizes';

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
  }, [id]);

  return (
    <Layout> 
      <View scrollable>
        {
          state.batches.map((item, index) => 
            <BatchListItem 
              data={item} 
              key={item.id} 
              onDelete={() => setState({
                ...state,
                batches: state.batches.filter((batch, batchIndex) => index !== batchIndex),
                })} 
            />
            )
        }
      </View>
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
      style={{ height: 100, borderRadius: 16 }}
      containerStyle={{
        height: '100%',
        width: '100%',
        backgroundColor: colors.background,
        borderRadius: 16
      }}
      rightContent={<Text color="white"><Icon name="delete" size={sizes.xl} /></Text>}
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
            <Col flex={1} centeredAll>
              <Heading centered size="m" bold>{localeDate(data.date).weekday} </Heading>
            </Col>
            <Col flex={1} centeredAll>
              <Row>
                <Text centered size="m" bold>Artículos: {data.articlesQuantity}</Text>
              </Row>
              <Row>
                <Text centered size="m" bold>Total: {fixed(data.total)}</Text>
              </Row>
            </Col>
          </Row>
        </View>
      </PressableLink>
    </SwipeableListItem>
  )  
}