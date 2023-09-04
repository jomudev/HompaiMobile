import React,
  {
    useState, 
    useEffect, 
    createRef, 
    useRef, 
    forwardRef, 
    useImperativeHandle,
    useCallback
  } from 'react';
import {
  Text, 
  TextBox, 
  Row, 
  Col,
  DataList,
  SwipeableListItem,
  View,
  LazyButton,
  Button,
  Heading,
  ListPicker,
  DateTimePicker,
  SectionsList
} from './UI';
import colors from '../../res/colors';
import { ActivityIndicator, Modal as RNModal, StyleSheet, Alert } from 'react-native';
import sizes from '../../res/sizes';
import PantryStore from '../../modules/PantryStore';
import Article from '../objects/Article';
import { Keyboard } from 'react-native';
const pantryStore = PantryStore.getInstance();

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
    const article = new Article(
      Math.random() * 1e9, 
      nameRef.current?.getValue(), 
      priceRef.current?.getValue(), 
      quantityRef.current?.getValue()
    );

    props.onSubmit(article);
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

export const ArticlesList = (props) => {
  return (
    <DataList
      data={props.articles}
      render={({item, index}) => (
        <DynamicArticlesListItem
          data={item}
          key={index * Math.random()}
          onModify={props.onModify}
          swipeableLeftContent={() => <Text>ℹ️</Text>}
          swipeableRightContent={() => <Text>🗑️</Text>}
          swipeableLeftFunction={props.onInfo}
          swipeableRightFunction={props.onDelete}
        />)}
    />)
}

export const ArticlesListTotal = (props) => {
  return <Heading style={{ marginTop: sizes.l }} centered size="l" muted > 💰 { fixed(props.total) } ({ props.quantity })</Heading>;
}

export const PantrySelector = (props) => {
  const [pantries, setPantries] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const modalRef = useRef();

  useEffect(() => {
    pantryStore.getPantries().then(pantries => {
      setPantries(pantries);
      props.onLoad(pantries);
      setLoading(false);
    });
  }, []);

  return isLoading ? <ActivityIndicator size="small" /> : (
      <ListPicker 
        initialValue={pantries[0]?.name}
        style={{zIndex: 1, marginBottom: 16, marginTop: 16}}
        onChange={props.onChange} 
        data={pantries.map(pantry => pantry.name)}>
        <Button textProps={{ numberOfLines: 1 }} onPress={() => modalRef.current.open()}>
          Nueva Despensa
        </Button>
        <Modal ref={modalRef}>
          <PantryCreator onSubmit={async (pantry) => {
              setPantries(pantries.concat(pantry))
            }}/>
        </Modal>
      </ListPicker>
    )
}

export const ArticlesHeader = (props) => {
  return (
  <View style={{ width: '100%'}}>
    {/**<PantrySelector onChange={props.onSelectPantry} onLoad={props.onLoadPantries} /> */}
    <ArticlesListTotal total={props.total} quantity={props.quantity} />
    <ArticleForm onSubmit={props.onAddArticle} />
  </View>
)}

export const ArticlesFooter = (props) => {
  const [hidden, hide] = useState(false);
  const handleHide = useCallback(() => hide(true));
  const handleShow = useCallback(() => hide(false));

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", handleHide); 
    Keyboard.addListener("keyboardDidHide", handleShow); 
    return () => {
      Keyboard.removeAllListeners("keyboardDidHide");
      Keyboard.removeAllListeners("keyboardDidShow");
    }
  }, []);

  return (
      <View style={{backgroundColor: "none", display: hidden ? "none" : "flex"}}>
        <Button 
          style={{
            marginTop: sizes.m,
            width: '50%',
            alignSelf: 'center',
            backgroundColor: colors.secondary,
            padding: sizes.m, 
          }}
          onPress={props.clearList}>
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
            setIsLoading(true);
            await props.onSubmit();
            setIsLoading(false);
          }}
          >
          📃 Guardar Lista
        </LazyButton>
      </View>)
}

export const Modal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const imperativeMethods = () => ({
    close: () => setVisible(false),
    open: () => setVisible(true),
  });  

  useImperativeHandle(ref, imperativeMethods);
    
  return (
    <RNModal 
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={() => imperativeMethods().close()}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
        {
          props.children
        }
        </View>
      </View>
    </RNModal>
  )
})

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
          <LazyButton onPress={async () => {
              const pantryName = inputRef.current.getValue();
              props?.onSubmit({
                id: parseInt(Math.random() * 1e9),
                pantryName
              });
              await pantryStore.createPantry(pantryName);
            }}>
            Crear
          </LazyButton>
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
            }} ref={ref} style={{flex: 1}} />
          : <ArticleView style={{ flex: 1 }} isPressable centered onPress={ () => setShowing(true) } >
              <Text bold>{props.defaultValue}</Text>
            </ArticleView>
      }
    </Col>
  );
});

export const DynamicArticlesListItem = (props) =>  {
  const nameRef = createRef(null);
  const priceRef = createRef(null);
  const quantityRef = createRef(null);

  const modify = useCallback((property, value) => {
    if (!value) {
      return;
    }
    Object.defineProperty(props.data, property, {
      value,
      writable: true,
    });
    props.onModify(props.data);
  }, []);

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
      rightPress={() => props?.swipeableRightFunction(props.data)}
      leftPress={() => props?.swipeableLeftFunction(props.data)}
      >
      <ArticleRow>
        <Col flex={2}>
          <ArticlesListItemInput
            autoFocus
            onBlur={() => modify("name", nameRef.current.getValue())}
            placeholder="Nombre"
            defaultValue={props.data.name}
            ref={nameRef}
            />
        </Col>
        <Col flex={1}>
          <ArticlesListItemInput
            autoFocus
            onBlur={ () => modify("price", priceRef.current.getValue()) }
            placeholder="💵"
            keyboardType="number-pad"
            defaultValue={fixed(props.data.price)}
            ref={priceRef}
            />
        </Col>
        <Col flex={1}>
          <ArticlesListItemInput
            autoFocus
            onBlur={ () => modify("quantity", quantityRef.current.getValue()) }
            placeholder="5️⃣"
            keyboardType="number-pad"
            defaultValue={fixed(props.data.quantity)}
            ref={quantityRef}
            />
        </Col>
        <Col flex={1}>
          <ArticleView>
            <Text muted >{ fixed(props.data.total) }</Text>
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
)}

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