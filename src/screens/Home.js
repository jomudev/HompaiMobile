import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  Container, 
  Heading, 
  Button, 
  Row, 
  Text,
  Col,
} from '../components/UI';
import { 
  AddedArticlesList,
  ArticleForm,
  ArticleRow,
} from '../components/HomeComponents';
import Storage from '../../modules/Storage';
import colors from '../../res/colors';

const storage = Storage.getInstance();

function addArticleToList(article, list) {
  if (article.name.trim() === "") {
    return;
  }
  list = list.articlesList.concat(article);
  storage.store("articleActualList", list);
  return list;
}

function listModifier(list, id, property, value) {
  if (value.trim() === "") {
    return list;
  }
  list = list.map((item) => item.id === id ? {...item, [property]: value} : item);
  storage.store("articleActualList", list);
  return list;
}

function deleteArticleFromList(id, list) {
  list = list.filter(item => item.id !== id);
  storage.store("articleActualList", list);
  return list;
}

const initialState = {
  articlesList: [],
  initializingList: true,
};

export default function Home () {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    (async function () {
      const articlesList = await storage.get("articleActualList")
      setState({...state, articlesList, initializingList: false});
    })();
  }, []);

  function total() {
    let total = state.articlesList.map((article) => parseFloat(article.price) * parseFloat(article.quantity));
    total = total.length && total.reduce((acc, val) => acc + val);
    return fixed(total);
  }


  return (
    <Layout>
      <Container flex={1} centered="horizontal">
      <Row >
        <Col>
          <Heading size="m" muted > Total contabilizado </Heading>
        </Col>
        <Col>
          <Heading size="xl" muted >{ total() }</Heading>
        </Col>
      </Row>
        <AddedArticlesList 
          header={<ArticleRow>
            <Col flex={1}>
              <Text>Foto</Text>
            </Col>
            <Col flex={1}>
              <Text>Nombre</Text>
            </Col>
            <Col flex={1}>
              <Text>Precio</Text>
            </Col>
            <Col flex={1}>
              <Text>Cantidad</Text>
            </Col>
            </ArticleRow>}
          isLoading={state.initializingList}
          data={state.articlesList}
          swipeableRightContent={() => <Text color={colors.background}>Eliminar</Text>}
          swipeableLeftContent={() => <Text color={colors.text}>Detalles</Text>}
          swipeableRightFunction={(id) => setState({...state, articlesList: deleteArticleFromList(id, state.articlesList)})} 
          swipeableLeftFunction={() => alert("function not implemented")}
          itemModifier={(id, property, value) => setState({...state, articlesList: listModifier(state.articlesList, id, property, value)})}
          footer={
            <ArticleForm
              addArticleToList={(article) => setState({...state, articlesList: addArticleToList(article, state)})}
              />
          }/>
        <Button onPress={() => alert("function not implemented")} >Guardar Despensa</Button>
      </Container>
    </Layout>
  );
};