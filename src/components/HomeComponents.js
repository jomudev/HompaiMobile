import React, { memo, useState, useRef } from 'react';
import {
  Text, 
  TextBox, 
  Row, 
  Col,
  DataList,
  SwipeableListItem,
  View,
  LazyLoading,
} from './UI';
import colors from '../../res/colors';

export const ArticleRow = (props) => (
  <Row centeredAll style={{ 
    gap: 16,
    width: '100%',
    height: 60,
    ...props.style 
  }}>
    { props.children }
  </Row>);

export const ArticleView = (props) => (
  <View {...props} style={{ 
    borderRadius: 16,
    backgroundColor: colors.secondary,
    height: '100%',
    width: '100%',
    }} centered>
      {props.children}
  </View>
);

export const ArticleForm = (({addArticleToList}) => {
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
  <ArticleRow>
    <Col flex={3}>
      <TextBox 
        placeholder="Nombre" 
        ref={nameRef}
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
        placeholder="Cant..." 
        ref={quantityRef}
        valueType="float"
        keyboardType='number-pad'
        onSubmitEditing={submit}
        />
    </Col>
  </ArticleRow>
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

  let nameRef = useRef(null);
  let priceRef = useRef(null);
  let quantityRef = useRef(null);

  if (props.isLoading) {
    return <LazyLoading size="large" />
  }
  
  return (
  <DataList 
    data={props.data} 
    render={({item}) => (
      <ArticlesListItem 
        item={item} 
        itemModifier={props.itemModifier}
        swipeableRightContent={props.swipeableRightContent}
        swipeableLeftContent={props.swipeableLeftContent}
        swipeableRightFunction={props?.swipeableRightFunction} 
        swipeableLeftFunction={props?.swipeableLeftFunction}
        />)}  
    footer={props.footer}
  />
)});

export const ArticlesListItem = (props)  => {
  const { item } = props;

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const quantityRef = useRef(null);

  const [state, setState] = useState({
    showNameInput: false,
    showPriceInput: false,
    showQuantityInput: false,
  });

  return (
    <SwipeableListItem
        rightContent={props.swipeableRightContent}
        leftContent={props.swipeableLeftContent}
        rightColor={colors.danger}
        leftColor={colors.secondary}
        rightPress={() => props?.swipeableRightFunction(item.id)}
        leftPress={() => props?.swipeableLeftFunction(item.id)}
        >
      <ArticleRow>
        <Col flex={1}>
          <ArticleView>
            <Text>Imagen</Text>
          </ArticleView> 
        </Col>
        <Col flex={1}>
          {
            state.showNameInput 
              ? <TextBox 
                  autoFocus
                  onEndEditing={() => props.itemModifier(item.id, "name", nameRef.current.getValue())}
                  placeholder="Nombre" 
                  defaultValue={item.name}
                  ref={nameRef}
                  />
              : <View isPressable centered onPress={() => setState(showInput("Name", state))}>
                  <Text bold>{item.name}</Text>
                </View>
          }
        </Col>
        <Col flex={1}>
          {
            state.showPriceInput 
              ? <TextBox 
                  autoFocus
                  placeholder="Precio" 
                  ref={priceRef}
                  valueType="float"
                  onEndEditing={() => props.itemModifier(item.id, "price", priceRef.current.getValue())}
                  keyboardType='number-pad'
                  defaultValue={item.price}
                  />
              : <ArticleView isPressable onPress={() => setState(showInput("Price", state))}>
                  <Text >{item.price}</Text>
                </ArticleView>
          }
        </Col>
        <Col flex={1}>
          {
            state.showQuantityInput ? 
              <TextBox 
                autoFocus
                placeholder="Cant..." 
                valueType="float"
                ref={quantityRef}
                onEndEditing={() => props.itemModifier(item.id, "quantity", quantityRef.current.getValue())}
                keyboardType='number-pad'
                defaultValue={item.quantity}
                />  
              : <ArticleView isPressable onPress={() => setState(showInput("Quantity", state))}>
                  <Text >{item.quantity}</Text>
                </ArticleView>
          }
        </Col>
    </ArticleRow>
  </SwipeableListItem>
)}