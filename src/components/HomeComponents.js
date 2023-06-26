import React, { memo, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  Text, 
  TextBox, 
  Row, 
  Col,
  DataList,
  SwipeableListItem,
  View,
  LazyLoading,
  Button,
  Heading,
  DateTimePicker
} from './UI';
import colors from '../../res/colors';
import { Modal as RNModal, StyleSheet } from 'react-native';
import PantryStore from '../../modules/PantryStore';
import sizes from '../../res/sizes';
const pantryStore = PantryStore.getInstance();

export const ArticleRow = (props) => (
  <Row centeredAll style={{ 
    gap: sizes.s,
    width: '100%',
    flex: 1,
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

export const ArticleForm = (({addArticleToList, ...props}) => {
  let nameRef = useRef(null);
  let priceRef = useRef(null);
  let quantityRef = useRef(null);

  const submit = () => {
    const article = {
      id: Math.random() * 1e9,
      name: nameRef.current?.getValue(),
      price: priceRef.current?.getValue(),
      quantity: quantityRef.current?.getValue() === '0.00' ? fixed(1) : quantityRef.current?.getValue(),
    };
    addArticleToList(article);
    nameRef.current.clear();
    priceRef.current.clear();
    quantityRef.current.clear();
    nameRef.current.focus();
  }

  return (
  <View style={{ height: 80, width: '100%', ...props.style }}>
    <ArticleRow>
      <Col flex={2}>
        <TextBox 
          placeholder="Nombre" 
          ref={nameRef}
          keyboardType="default"
          onSubmitEditing={submit}
            />
      </Col>
      <Col flex={1}>
        <TextBox 
          placeholder="Precio" 
          ref={priceRef}
          valueType="float"
          keyboardType='number-pad'
          onSubmitEditing={submit}
            />
      </Col>
      <Col flex={1}>
        <TextBox 
          placeholder="Cantidad" 
          ref={quantityRef}
          valueType="float"
          keyboardType='number-pad'
          onSubmitEditing={submit}
          />
      </Col>
    </ArticleRow>
  </View>
)});

/**
 * AddedArticlesList Component Functions
 */
const showInput = (inputName, state) => {
  return {
    ...state,
    [`show${inputName}Input`]: !state[`show${inputName}Input`]
  };
};
/**
 * 
 */

export const AddedArticlesList = memo((props) => {

  if (props.isLoading) {
    return <LazyLoading size="large" />
  }
  
  return (
  <DataList 
    header={props.header}
    data={props.data} 
    render={({item, index}) => (
      <DynamicArticlesListItem
        item={item} 
        key={index}
        itemModifier={props.itemModifier}
        swipeableRightContent={props.swipeableRightContent}
        swipeableLeftContent={props.swipeableLeftContent}
        swipeableRightFunction={props?.swipeableRightFunction} 
        swipeableLeftFunction={props?.swipeableLeftFunction}
        />)}  
    footer={props.footer}
  />
)});

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
              createPantry(inputRef.current.getValue());
              props?.onSubmit()
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
          ? <TextBox { ...props } ref={ref}/>
          : <View isPressable centered onPress={ () => setShowing(true) } >
              <Text bold>{props.defaultValue}</Text>
            </View>
      }
    </Col>
  );
})

export const DynamicArticlesListItem = ({item, ...props})  => {
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);
  const expirationDateRef = useRef(null);

  return (
    <SwipeableListItem
      style={{ 
        height: 88,
        borderRadius: sizes.m,
        padding: sizes.s,
        backgroundColor: colors.background,
      }}
      rightContent={props.swipeableRightContent}
      leftContent={props.swipeableLeftContent}
      rightColor={colors.danger}
      leftColor={colors.secondary}
      rightPress={() => props?.swipeableRightFunction(item.id)}
      leftPress={() => props?.swipeableLeftFunction(item.id)}
      >
      <ArticleRow>
        <Col flex={2}>
          <ArticlesListItemInput
            autoFocus
            onEndEditing={ () => props.itemModifier(item.id, "name", nameRef.current.getValue()) }
            placeholder="Nombre"
            defaultValue={item.name}
            ref={nameRef}
           />
        </Col>
          <ArticlesListItemInput
            autoFocus
            onEndEditing={ () => props.itemModifier(item.id, "price", priceRef.current.getValue()) }
            placeholder="Precio"
            defaultValue={item.price}
            ref={priceRef}
           />
        <Col flex={1}>
          <ArticlesListItemInput
            autoFocus
            onEndEditing={ () => props.itemModifier(item.id, "quantity", quantityRef.current.getValue()) }
            placeholder="Cantidad"
            defaultValue={item.price}
            ref={quantityRef}
           />
        </Col>
    </ArticleRow>
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
  </SwipeableListItem>
)}

const styles = StyleSheet.create({
  modalView: {
    width: '80%',
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