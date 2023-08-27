import React, { Component, useState, useEffect, useRef, forwardRef } from 'react';
import {
  Text, 
  TextBox, 
  Row, 
  Col,
  DataList,
  SwipeableListItem,
  Alert,
  View,
  LazyButton,
  Button,
  Heading,
  ListPicker,
  DateTimePicker,
  SectionsList
} from './UI';
import colors from '../../res/colors';
import { Modal as RNModal, StyleSheet } from 'react-native';
import sizes from '../../res/sizes';
import HomeLogic from '../screens/screensLogic/HomeLogic/Home.logic';
import PantryStore from '../../modules/PantryStore';
import Article from '../objects/Article';
const pantryStore = PantryStore.getInstance();
const logic = new HomeLogic();


export const ArticleRow = (props) => (
  <Row centeredAll style={{ 
    gap: sizes.s,
    width: '100%',
    ...props.style 
  }}>
    { props.children }
  </Row>);

export const ArticleView = (props) => (
  <View {...props} style={{ 
    borderRadius: 16,
    height: '100%',
    width: '100%',
    backgroundColor: colors.secondary,
    }} centered>
      {props.children}
  </View>
);

export const ArticleForm = (props) => {
  let nameRef = useRef(null);
  let priceRef = useRef(null);
  let quantityRef = useRef(null);

  const submit = () => {
    
    const article = new Article(Math.random() * 1e9, nameRef.current?.getValue(), priceRef.current?.getValue(), quantityRef.current?.getValue())
    logic.articlesList.add(article);
    nameRef.current.clear();
    priceRef.current.clear();
    quantityRef.current.clear();
    nameRef.current.focus();
  }

  return (
  <View 
    centered="horizontal" 
    style={{ 
      width: '100%', 
      height: 44, 
      backgroundColor: colors.background, 
      borderRadius: sizes.m, 
      padding: sizes.xs 
      }}>
    <ArticleRow>
      <Col flex={2}>
        <TextBox 
          placeholder="Nombre del Artículo" 
          ref={nameRef}
          keyboardType="default"
          onSubmitEditing={submit}
            />
      </Col>
      <Col flex={1}>
        <TextBox 
          placeholder="💵" 
          ref={priceRef}
          valueType="float"
          keyboardType='number-pad'
          onSubmitEditing={submit}
            />
      </Col>
      <Col flex={1}>
        <TextBox 
          placeholder="5️⃣" 
          ref={quantityRef}
          valueType="float"
          keyboardType='number-pad'
          onSubmitEditing={submit}
          />
      </Col>
    </ArticleRow>
    <ArticleRow>
      <Text centered muted size={sizes.xs}>Presiona ✔️ en el teclado para agregar el artículo</Text>
    </ArticleRow>
  </View>
)};

export const ArticlesListSection = (props) => {
  return (
  <SectionsList 
    header={props.header}
    sections={[props.content]}  
    footer={props.footer}
  />
)};

export const ArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const subscriber = logic.articlesList.addObserver(() => {
      const change = logic.articlesList.lastChange;
      if (change) {
        if (change.type !== "add" && change.type !== "set") {
          return;
        }
        setArticles(logic.articlesList.list);
      }
    });
    return subscriber();
  }, [articles]);

  return (
    <DataList
      data={articles} 
      render={({item, index}) => (
        <DynamicArticlesListItem
          item={item} 
          key={index * Math.random() * 1000 }
          swipeableLeftContent={() => <Text>ℹ️</Text>}
          swipeableRightContent={() => <Text>🗑️</Text>}
          swipeableLeftFunction={() => Alert.alert("Función no implementada", "Muy pronto estaremos implementando esta función")}
          swipeableRightFunction={(id) => logic.articlesList.remove(id)}
        />)}
    />)
}

export const ArticlesListTotal = () => {
  const [state, setState] = useState({
    total: 0,
    quantity: 0,
  });

  useEffect(() => {
    const subscriber = logic.articlesList.addObserver(() => {
      setState({
        total: logic.articlesList.total,
        quantity: logic.articlesList.list.length,
      });
    });
    return subscriber;
  }, []);

  return <Heading centered size="l" muted > 💰 { fixed(state.total) } ({ state.quantity })</Heading>;
}

export const PantrySelector = () => {
  const [loading, setLoading] = useState(true);
  const modalRef = useRef();

  useEffect(() => {
    const subscriber = logic.pantriesList.addObserver(() => {

      if (logic.pantriesList.list.length === 0) {
        return;
      }
      logic.selectedPantry = logic.pantriesList.list[0]?.name;
      setLoading(false);
    });

    return subscriber;
  }, [loading]);  

  return !loading && (
      <ListPicker 
        initialValue={logic.pantriesList.list[0]?.name}
        style={{zIndex: 1, marginBottom: 16, marginTop: 16}}
        onChange={(value) => logic.selectedPantry = value} 
        data={logic.pantriesList.list.map(pantry => pantry.name)}>
        <Button textProps={{ numberOfLines: 1 }} onPress={() => modalRef.current.open()}>
          Nueva Despensa
        </Button>
        <Modal ref={modalRef}>
          <PantryCreator onSubmit={async (pantry) => {
              modalRef.current.close();
              logic.pantriesList.add(pantry);
            }}/>
        </Modal>
      </ListPicker>
    )
}

export const ArticlesHeader = () => {
  return (
  <View style={{ width: '100%'}}>
    <PantrySelector />
    <ArticlesListTotal />
    <ArticleForm />
  </View>
)}

export const ArticlesFooter = () => {
  const [listIsReady, setListReady] = useState(false);
  const [userWantView, setUserWantView] = useState(false);

  useEffect(() => {
    const subscriber = logic.articlesList.addObserver(() => {
      let isListReady = true;
      if (logic.articlesList.list.length > 0 && logic.selectedPantry) {
        isListReady = true;
        return;
      }
      setListReady(isListReady);
    });
    return subscriber;
  }, []);

  return listIsReady && (
    <View>
        <View style={{backgroundColor: "none"}}>
          <Button 
            style={{
              marginTop: sizes.m,
              width: '50%',
              alignSelf: 'center',
              backgroundColor: colors.secondary,
              padding: sizes.m, 
            }}
            onPress={() => {
              Alert.alert("Vaciar", "Seguro que quieres vaciar lista?", [
                {
                  text: "No",
                  onPress: () => {}
                },
                {
                  text: "Sí",
                  onPress: () => logic.articlesList.clear()
                }
              ])
            }}>
            🧹 Limpiar Lista
          </Button>
          <LazyButton
            style={{
              marginTop: sizes.m,
              width: '50%',
              alignSelf: 'center',
              backgroundColor: colors.warning,
              padding: sizes.m, 
            }}
            textStyle={{
              color: 'white',
            }}
            onPress={async () => {
              if (!listIsReady) {
                return;
              }
              await logic.createBatch(logic.selectedPantry);
            }}
            >
            📃 Guardar Lista
          </LazyButton>
        </View>
    </View>)
}

export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  open() {
    this.setState({ visible: true });
  }
  
  close() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <RNModal 
        visible={this.state.visible}
        transparent
        animationType='slide'
        onRequestClose={() => this.close()}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          {
            this.props.children
          }
          </View>
        </View>
      </RNModal>
    )
  }
}

/**
 * 
 */
function createPantry(pantryName) {
  pantryStore.createPantry(pantryName);
}
//

export const PantryCreator = (props, ref) => {
  const inputRef = useRef();

  return (
    <View centered >
      <Heading size="l" bold >Agrega una despensa</Heading>
      <Row gap={16} style={{ height: 40 }}>
        <Col flex={1}>
          <TextBox 
            ref={inputRef}
            placeholder="Nombre"
          />
        </Col>
        <Col flex={1}>
          <Button onPress={() => {
              const pantryName = inputRef.current.getValue();
              createPantry(pantryName);
              props?.onSubmit({
                id: parseInt(Math.random() * 1e9),
                pantryName
              });
            }}>
            Crear
          </Button>
        </Col>
      </Row>
    </View>
  );
}

const ArticlesListItemInput = forwardRef(({item, ...props}, ref) => {
  const [showing, setShowing] = useState(false);
  return (
    <Col>
      {
        showing 
          ? <TextBox {...props} onBlur={() => {
              props?.onBlur();
              setShowing(false);
            }} ref={ref} value={props?.defaultValue} style={{flex: 1}} />
          : <ArticleView style={{ flex: 1 }} isPressable centered onPress={ () => setShowing(true) } >
              <Text bold>{props.defaultValue}</Text>
            </ArticleView>
      }
    </Col>
  );
})

function articleModifier (id, property, value) {
  return logic.articlesList.modify(id, property, value);
}

export class DynamicArticlesListItem extends Component  {
  constructor({item, ...props}) {
    super(props);
    this.state = {
      ...item,
      visible: true,
    }
    this.nameRef = useRef(null);
    this.priceRef = useRef(null);
    this.quantityRef = useRef(null);
    this.unsubscribe = null;
  }

  subscribe() {
    return logic.articlesList.addObserver(() => {
      const change = logic.articlesList.lastChange;
      if (change === null) {
        return;
      }
      if (change.type === "modified") {
        if (change.data.id !== data.id) {
          return;
        }
        this.setState({
          ...this.state,
          ...data,
        })
      } 
      if (change.type === "remove") {
        if (change.data !== data.id) {
          return;
        }
        this.setState({
          ...this.state,
          visible: false,
        })
      }
    });
  }

  componentDidMount() {
    this.unsubscribe = this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    if (!this.state.visible) {
      return null;
    }
    return (
      <SwipeableListItem
        style={{ 
          height: 50,
          borderRadius: sizes.m,
          padding: sizes.s,
          backgroundColor: colors.background,
        }}
        rightContent={props.swipeableRightContent}
        leftContent={props.swipeableLeftContent}
        rightColor={colors.danger}
        leftColor={colors.secondary}
        rightPress={() => props?.swipeableRightFunction(this.state.id)}
        leftPress={() => props?.swipeableLeftFunction(this.state.id)}
        >
        <ArticleRow>
          <Col flex={2}>
            <ArticlesListItemInput
              autoFocus
              onBlur={() => articleModifier(this.state.id, "name", this.nameRef.current.getValue())}
              placeholder="Nombre"
              defaultValue={data.name}
              ref={this.nameRef}
             />
          </Col>
          <Col flex={1}>
            <ArticlesListItemInput
              autoFocus
              onBlur={ () => articleModifier(this.state.id, "price", this.priceRef.current.getValue()) }
              placeholder="💵"
              defaultValue={fixed(data.price)}
              ref={this.priceRef}
             />
          </Col>
          <Col flex={1}>
            <ArticlesListItemInput
              autoFocus
              onBlur={ () => articleModifier(this.state.id, "quantity", this.quantityRef.current.getValue()) }
              placeholder="5️⃣"
              defaultValue={fixed(data.quantity)}
              ref={this.quantityRef}
             />
          </Col>
          <Col flex={1}>
            <ArticleView>
              <Text muted >{ fixed(this.state.quantity * this.state.price) }</Text>
            </ArticleView>
          </Col>
      </ArticleRow>
      {
        /**
        <ArticleRow>
          <DateTimePicker 
            label="Caducidad"
            onChange={(value) => props.itemModifier(item.id, "expirationDate", value)}
            ref={expirationDateRef} 
            initialValue={item.expirationDate}
            style={{
              elevation: 0,
              padding: 0,
            }}/>
        </ArticleRow>
         */
      }
    </SwipeableListItem>
  )
  }

}

const styles = StyleSheet.create({
  modalView: {
    width: '70%',
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    alignSelf: 'center',
    elevation: 90,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});