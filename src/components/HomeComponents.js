import React,
  {
    useState, 
    useEffect,
    useRef, 
    forwardRef, 
    useImperativeHandle,
    useCallback,
    memo
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
  FAB,
  DateTimePicker,
  SectionsList
} from './UI';
import colors from '../../res/colors';
import { ActivityIndicator, Modal as RNModal, StyleSheet, Alert, SectionList } from 'react-native';
import sizes from '../../res/sizes';
import { Keyboard } from 'react-native';
import ArticleBuilder from '../objects/ArticleBuilder';
import { Info, Delete, MoneyBag, Numbers } from '../../res/icons';
import { log } from '../../res/Debug';
const CLEAR_TEXT = "";

export const ArticleRow = (props) => (
  <Row centeredAll style={{ 
    gap: sizes.s,
    width: '100%',
    height: '100%',
  }}>
    { props.children }
  </Row>);

export const ArticleView = ({ showing, onPress, ...props}) => (
  <View isPressable={true} centered onPress={onPress} style={{
    flex: 1,
    ...showing && { display: 'none' },
    borderRadius: 16,
    height: '100%',
    width: '100%',
    backgroundColor: colors.secondary,
    }} centered>
      {props.children}
  </View>
);

export const ArticleForm = ({ selectedCategory, onSubmit }) => {
  const name = useRef("");
  const price = useRef("");
  const quantity = useRef("");
  const nameRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      nameRef.current.focus();
    }, 1);
  });

  const cleanFields = () => {
    name.current = CLEAR_TEXT;
    price.current = CLEAR_TEXT;
    quantity.current = CLEAR_TEXT;
    nameRef.current.clear();
    priceRef.current.clear();
    quantityRef.current.clear();
  }

  const submitArticle = () => {
    if (selectedCategory.trim() === "") {
      selectedCategory = "Varios";
    }
    const article = ArticleBuilder.createLocalArticle({
      id: Math.random() * 1e9, 
      name: name.current, 
      price: price.current, 
      quantity: quantity.current, 
      category: selectedCategory
    });
    onSubmit(article)
    cleanFields();
  }

  return (
  <Col 
    centered="horizontal" 
    style={{ 
      width: '100%',
      height: 100,
      borderRadius: sizes.m,
      }}>
      <Row style={{ height: 80}} gap={sizes.s}>
        <Col flex={2}>
          <TextBox 
            placeholder="Nombre del Artículo"
            ref={nameRef}
            onChangeText={(text) => (name.current = text)}
            keyboardType="default"
            onSubmitEditing={submitArticle}
              />
        </Col>
        <Col flex={1}>
          <TextBox 
            placeholder="💵" 
            ref={priceRef}
            keyboardType='number-pad'
            onChangeText={(text) => (price.current = text)}
            onSubmitEditing={submitArticle}
              />
        </Col>
        <Col flex={1}>
          <TextBox 
            placeholder="5️⃣"
            ref={quantityRef}
            keyboardType='number-pad'
            onChangeText={(text) => (quantity.current = text)}
            onSubmitEditing={submitArticle}
            />
        </Col>
      </Row>
      <Text centered muted size={sizes.xs}>Presiona ✔️ en el teclado para agregar el artículo</Text>
  </Col>
)};

export const ArticlesList = ({ articles, onModify, onDelete, onInfo }) => {
  return (
    <DataList
      data={articles}
      render={({item, index}) => (
        <DynamicArticlesListItem
          data={item}
          key={index * Math.random()}
          onModify={onModify}
          swipeableLeftContent={() => <Info />}
          swipeableRightContent={() => <Delete />}
          swipeableLeftFunction={onInfo}
          swipeableRightFunction={onDelete}
        />)}
    />)
}

export const ArticlesListTotal = ({ total, quantity }) => {
  return (
    <Heading centered size="l" muted > 
      <MoneyBag />
      { currency(total)} 
      {' '}
      <Numbers />
      {' '}
      { quantity }
      </Heading>
  );
}

export const CategoriesCreator = ({ setSelectedCategory }) => {
  const [category, setCategory] = useState("");
  return (
    <View style={{ height: 44, padding: sizes.xs}}>
      <ArticleRow>
        <Col flex={1} >
          <TextBox 
            placeholder="Categoría"
            value={category}
            onChangeText={setCategory}
            onEndEditing={() => setSelectedCategory(category)}
          />
        </Col>
      </ArticleRow>
    </View>
  );
}

export const CategoriesList = ({articles, selectedCategory, addArticle, removeArticle, modifyArticle}) => {
  const ArticlesAdderModalRef = useRef();

  const submitHandler = (article) => {
    addArticle(article);
    ArticlesAdderModalRef.current.close();
  }

  function groupBy(array = [], property) {
    const reducer = function(groups, item) {
      let title = item[property]
      let group = groups[title] || (groups[title] = { title, data: []});
      group.data.push(item);
      return groups;
    };
    return array.reduce(reducer, {});
  }

  let list = groupBy(articles, 'category');
  list = Object.keys(list).map(key => list[key]);
  
  return (
    <SectionList 
      removeClippedSubviews
      initialNumToRender={10}
      sections={list}
      keyExtractor={(item, index) => item.name + item.price + item.quantity + index}
      renderItem={({item}) => <DynamicArticlesListItem
          data={item}
          onModify={(article) => modifyArticle(article)}
          swipeableRightContent={() => <Text>🗑️</Text>}
          swipeableLeftFunction={() => {}}
          swipeableRightFunction={removeArticle}
        />}
      renderSectionHeader={({section: {title}}) => (
        <ArticlesSectionHeader>
          <Heading size="xl" flex={1} >{ title }</Heading>
          {
            selectedCategory !== title ? 
              (
                <Modal ref={ArticlesAdderModalRef} buttonText="Agregar artículo" title={`Agregar artículo a ${title}`}>
                  <ArticleForm onSubmit={submitHandler} selectedCategory={title} />
                </Modal>
              ) : null
          }
        </ArticlesSectionHeader>
      )}
    />
  );
};

export const ArticlesSectionHeader = (props) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: sizes.m,
      paddingTop: sizes.m,
    }}>
      { props.children }
    </View>
  )
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
        <Modal ref={modalRef} buttonText="Nueva Despensa">
          <PantryCreator title={"Agrega una nueva despensa"} onSubmit={(pantry) => setPantries(pantries.concat(pantry))}/>
        </Modal>
      </ListPicker>
    )
}

export const ArticlesHeader = ({ quantity, total, addArticle, selectedCategory }) => {
  return (
  <View style={{ width: '100%'}}>
    {/**<PantrySelector onChange={props.onSelectPantry} onLoad={props.onLoadPantries} /> */}
    <ArticlesListTotal total={total} quantity={quantity} />
    <ArticleForm onSubmit={addArticle} selectedCategory={selectedCategory} />
  </View>
)}

export const ArticlesFooter = ({clearList, ...props}) => {
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
      <View style={{paddingBottom: 60, backgroundColor: "none", display: hidden ? "none" : "flex"}}>
        <Button 
          style={{
            marginTop: sizes.m,
            width: '50%',
            alignSelf: 'center',
            backgroundColor: colors.secondary,
            padding: sizes.m, 
          }}
          onPress={clearList}>
          🧹 Limpiar Lista
        </Button>
        {/**<LazyButton
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
        </LazyButton> */}
      </View>)
}

export const HomeFAB = ({ clearArticles, ...props }) => {
  return (
    <FAB actions={[
      {
        value: '🧹',
        action: clearArticles,
      },
    ]} >
      {
        props.children
      }
    </FAB>
  );
};

export const Modal = forwardRef(({ title, buttonText, ...props}, ref) => {
  const [visible, setVisible] = useState(false);

  const imperativeMethods = () => ({
    close: () => setVisible(false),
    open: () => setVisible(true),
  });  

  useImperativeHandle(ref, imperativeMethods);
    
  return (
    <View style={{ flex: 1 }}>
      <Button width="100%" onPress={() => setVisible(true)}>
        <Text>{ buttonText }</Text>
      </Button>
      <RNModal 
        visible={visible}
        transparent
        animationType='slide'
        onRequestClose={() => imperativeMethods().close()}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          <Heading centered style={{ marginBottom: sizes.m }}>{ title }</Heading>
          {
            props.children
          }
          </View>
        </View>
      </RNModal>
    </View>
  )
})

export const Creator = ({ title, onSubmit }) => {
  const inputRef = useRef();

  return (
    <View centered >
      <Heading size="l" bold >{ title }</Heading>
      <Row gap={16} style={{ height: 40 }}>
        <Col flex={1}>
          <TextBox 
            placeholder="Nombre"
          />
        </Col>
        <Col flex={1}>
          <LazyButton onPress={() => onSubmit && onSubmit(inputRef.current.getValue())}>
            Crear
          </LazyButton>
        </Col>
      </Row>
    </View>
  );
}

export const PantryCreator = (props) => {
  const inputRef = useRef();

  return (
    <View centered >
      <Heading size="l" bold >{ props.title }</Heading>
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

const ArticlesListItemInput = forwardRef(({ defaultValue, formatter, placeholder, initialValue, item, ...props}, ref) => {
  const [showing, setShowing] = useState(false);
  const showDefaultValue = (value) => formatter ? formatter(value) : value;

  function showHandle() {
    setShowing(true); 
    setTimeout(() => {
      ref.current.focus();
    }, 250);
  }

  function submit()  {
    showing && props?.onBlur();
    setShowing(false);
  }

  return (
    <Row style={{height: '100%'}}>
      <ArticleView showing={showing} onPress={showHandle} >
        <Text bold>{ showDefaultValue(defaultValue) }</Text>
      </ArticleView>
      <TextBox
        selectTextOnFocus
        placeholder={placeholder?.toString()} 
        defaultValue={defaultValue?.toString()} 
        onBlur={submit} ref={ref} style={{flex: 1, ...!showing && { display: 'none' }}} />
    </Row>
  );
});

export const DynamicArticlesListItem = function DynamicArticlesListItem({ data,  onModify, ...props}) {
  const nameRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();

  function modify() {
    const name = nameRef.current.getValue() || data.name;
    const price = priceRef.current.getValue() || data.price;
    const quantity = quantityRef.current.getValue() || data.quantity;
    let modifiedArticle = ArticleBuilder.createLocalArticle(data.id, name, price, quantity, data.category);
    onModify && onModify(modifiedArticle);
  };

  return (
    <SwipeableListItem
      style={{ 
        height: 80,
        borderRadius: sizes.m,
        padding: sizes.s,
        backgroundColor: colors.background,
      }}
      rightContent={props?.swipeableRightContent}
      rightColor={colors.danger}
      leftColor={colors.secondary}
      rightPress={() => props?.swipeableRightFunction(data)}
      leftPress={() => props?.swipeableLeftFunction(data)}
      >
      <ArticleRow>
        <Col flex={2}>
          <ArticlesListItemInput
            onBlur={modify}
            placeholder="Nombre"
            defaultValue={data.name}
            ref={nameRef}
            />
        </Col>
        <Col flex={1}>
          <ArticlesListItemInput
            onBlur={modify}
            placeholder="💵"
            keyboardType="number-pad"
            defaultValue={data.price}
            formatter={currency}
            ref={priceRef}
            />
        </Col>
        <Col flex={1}>
          <ArticlesListItemInput
            onBlur={modify}
            placeholder={'🔢'}
            formatter={quantify}
            keyboardType="number-pad"
            defaultValue={data.quantity}
            ref={quantityRef}
            />
        </Col>
        <Col flex={1}>
          <ArticleView>
            <Text muted >{ currency(data.total) }</Text>
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
)};

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