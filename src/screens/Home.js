import React, { useEffect, useState, useRef } from 'react';
import { 
  Layout, 
  Container, 
  Heading, 
  LazyButton, 
  View,
  Button,
  Row, 
  Text,
  Col,
  ListPicker,
} from '../components/UI';
import {
  AddedArticlesList,
  ArticleForm,
  Modal,
  PantryCreator,
} from '../components/HomeComponents';
import Storage from '../../modules/Storage';
import PantryStore from '../../modules/PantryStore';
import colors from '../../res/colors';
import screens from '../../res/screens';
import { Link } from '@react-navigation/native';
import sizes from '../../res/sizes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const storage = Storage.getInstance();
const pantry = PantryStore.getInstance();

function addArticleToList(article, list) {
  if (article.name.trim() === "") {
    return list;
  }
  list = list.articlesList.concat(article);
  storage.store("articleActualList", list);
  return list;
}

function listModifier(list, id, property, value) {
  if (typeof value === "string" && value.trim() === "") {
    return list;
  }
  list = list.map((item) => 
    item.id === id 
    ? {
        ...item, 
        [property]: typeof value === "string" 
                      ? value.trim() 
                      : value
      } 
    : item);
  storage.store("articleActualList", list);
  return list;
}

function deleteArticleFromList(id, list) {
  list = list.filter(item => item.id !== id);
  storage.store("articleActualList", list);
  return list;
}

const initialState = {
  pantries: [],
  articlesList: [],
  initializingList: true,
};

async function getPantries() {
  return await pantry.getPantries() || [];
}

export default function Home () {
  const [state, setState] = useState(initialState);
  const modalRef = useRef();
  const pantryRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const articlesList = await storage.get("articleActualList");
      let newState = {
        ...state,
        articlesList,
        initializingList: false,
      }
      setState(newState);
      const pantries = await getPantries();
      setState({ ...newState, pantries });
    }
    fetchData();
  }, []);

  function total() {
    let total = state.articlesList.map((article) => parseFloat(article.price) * parseFloat(article.quantity));
    total = total.length && total.reduce((acc, val) => acc + val);
    return fixed(total);
  }

  return (
    <Layout>
    <KeyboardAwareScrollView 
      style={{ width: '100%' }}
      contentContainerStyle={{width: '100%'}}>
      <Container centered style={{ paddingVertical: 0, flex: 1 }} >
        <Row >
          <Col>
            <Heading size="m" muted > Total contabilizado </Heading>
          </Col>
          <Col>
            <Heading size="l" muted >{ total() }</Heading>
          </Col>
        </Row>
        <ListPicker 
          style={{zIndex: 1, paddingBottom: 16}} 
          ref={pantryRef}
          onChange={(value) => setPantryName(value)}
          data={state.pantries.map(pantry => pantry.name)}>
          <Button textProps={{ numberOfLines: 1 }} onPress={() => modalRef.current.open()}>
              Nueva Despensa
          </Button>
          <Modal ref={modalRef}>
            <PantryCreator onSubmit={async () => {
                modalRef.current.close()
                setState({
                  ...state,
                  pantries: await getPantries(),
                });
              }}/>
          </Modal>
        </ListPicker>
      </Container>
        <AddedArticlesList
          isLoading={state.initializingList}
          data={state.articlesList}
          swipeableRightContent={() => <Text color={colors.background}>Eliminar</Text>}
          swipeableLeftContent={() => <Text color={colors.text}>Detalles</Text>}
          swipeableRightFunction={(id) => setState({...state, articlesList: deleteArticleFromList(id, state.articlesList)})} 
          swipeableLeftFunction={() => alert("function not implemented")}
          itemModifier={(id, property, value) => setState({...state, articlesList: listModifier(state.articlesList, id, property, value)})}
          header={
            <View  style={{ width: '90%', alignItems: 'center' }}>
                <ArticleForm
                  style={{ height: 40, backgroundColor: colors.background, borderRadius: sizes.m, padding: sizes.xs }}
                  addArticleToList={(article) => 
                    setState({
                      ...state, 
                      articlesList: addArticleToList(article, state)
                    })
                  }/>
            </View>
          }
          footer={
            state.articlesList.length 
            ? <LazyButton
                style={{ padding: sizes.m, marginBottom: sizes.s }}
                onPress={() => 
                  pantry.createBatch(state.pantries.find((pantry) => 
                    pantry.name === pantryRef.current.getValue()), 
                    state.articlesList
                  )}
                >
                Agregar provisión
              </LazyButton>
            : null
                  }
            />
      </KeyboardAwareScrollView>
    </Layout>
  );
};