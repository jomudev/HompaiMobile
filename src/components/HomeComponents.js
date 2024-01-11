import React,
  {
    useState, 
    useEffect,
    useRef, 
    forwardRef, 
    useImperativeHandle,
  } from 'react';
import {
  Text, 
  TextBox, 
  Row, 
  Col,
  DataList,
  SwipeableListItem,
  View,
  Button,
  Heading,
  SectionedFAB
} from './UI';
import colors from '../../res/colors';
import { Modal as RNModal, StyleSheet, Alert, SectionList, Pressable, VirtualizedList, ScrollView } from 'react-native';
import sizes from '../../res/sizes';
import ArticleBuilder from '../objects/ArticleBuilder';
import { MoneyBag, Numbers } from '../../res/icons';
import PantryStore from '../../modules/PantryStore';
import { groupBy, timeOut } from '../../res/utils';
import getInitials from '../../res/getInitials';
import useArticlesNames from '../hooks/ArticlesNames';
import ModifyArticleForm from './HomeComponents/ModifyArticleForm';
import { Delete, Pencil } from '../../res/icons';
const CLEAR_TEXT = "";

export const ArticleRow = (props) => (
  <Row centeredAll style={{ 
    gap: sizes.s,
    flex: 1,
  }}>
    { props.children }
  </Row>);

export const ArticleView = ({ onPress, ...props}) => (
  <View 
    isPressable
    centered 
    onPress={onPress} 
    style={{
      flex: 1,
      ...showing && { display: 'none' },
      borderRadius: 16,
      height: '100%',
      width: '100%',
      backgroundColor: colors.secondary,
    }}>
      {props.children}
  </View>
);

const AutoCompleteView = ({ list=[], value, onSelect, deleteFunction }) => {
  const matchList = list.filter(item => item.includes(value));
  if (value.trim() === "" || matchList.length === 0) {
    return null;
  }

  const handleSelect = (value) => {
    onSelect(value);
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      shadowOffset: { width: 0, height: sizes.xl },
      paddingHorizontal: sizes.m, 
      paddingVertical: sizes.s,
      zIndex: 1,
      maxHeight: 200,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {
        matchList.map((item) => (
          <AutoCompletableListItem 
            key={JSON.stringify(item)} 
            label={ item?.name ? `${item.name} ${item.price}` : item} 
            onSelect={handleSelect} 
            deleteFunction={() => deleteFunction(item)} 
            />
        ))
      }
    </ScrollView>
  );
}

export const AutoCompletableListItem = ({ label, onSelect, deleteFunction }) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: sizes.m,
      paddingHorizontal: sizes.s,
      width: '100%',
      borderBottomColor: colors.secondary,
      borderBottomWidth: 1,
    }
  });
  return (
    <Row style={styles.container}>
      <Pressable onPress={() => onSelect(label)} key={label} style={{ width: '100%' }}>
        <Text bold size={sizes.l}>{ label }</Text>
      </Pressable>
      <Pressable onPress={deleteFunction}>
        <Text>❌</Text>
      </Pressable>
    </Row>
    )
}

export const ArticleForm = ({ selectedCategory, onSubmit }) => {
  const [name, setName] = useState("");
  const price = useRef("");
  const quantity = useRef("");
  const nameRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();
  selectedCategory = selectedCategory.current || "Varios";

  const styles = StyleSheet.create({
    form: { 
      position: 'relative', 
      alignItems: 'flex-start',
      width: '100%', 
      borderRadius: sizes.m , 
      paddingHorizontal: sizes.xs
    },
    row: { overflow: 'visible', height: 80 },
  });

  
  useEffect(() => {
    const focusName = async () => await timeOut(100)
      .then(() => (nameRef.current.focus()));
    focusName();
  },  []);
  
  const cleanFields = () => {
    setName(CLEAR_TEXT);
    price.current = CLEAR_TEXT;
    quantity.current = CLEAR_TEXT;
    nameRef.current.clear();
    priceRef.current.clear();
    quantityRef.current.clear();
  }

  const submitArticle = async () => {
    if (selectedCategory.trim() === "")
      selectedCategory = "Varios";
    
    const article = ArticleBuilder.createLocalArticle({
      name: name, 
      price: price.current, 
      quantity: quantity.current, 
      category: selectedCategory
    });
    cleanFields();
    onSubmit(article);
  }
  return (
    <Col 
      style={styles.form}>
        <Row style={styles.row} gap={sizes.xs}>
          <Col flex={2}>
            <TextBox
              placeholder="Nombre del Artículo"
              ref={nameRef}
              value={name}
              onChangeText={setName}
              keyboardType="default"
              onSubmitEditing={submitArticle}
                />
          </Col>
          <Col flex={1}>
            <TextBox 
              placeholder="Precio" 
              ref={priceRef}
              keyboardType='number-pad'
              onChangeText={(text) => (price.current = text)}
              onSubmitEditing={submitArticle}
                />
          </Col>
          <Col flex={1}>
            <TextBox 
              placeholder="Cantidad"
              ref={quantityRef}
              keyboardType='number-pad'
              onChangeText={(text) => (quantity.current = text)}
              onSubmitEditing={submitArticle}
              />
          </Col>
        </Row>
        <Text centered muted size={sizes.xs}>Presiona ✔️ en el teclado para agregar el artículo</Text>
    </Col>
  )
};

export const ArticlesList = ({ articles, onModify, onDelete, onInfo }) => {
  return (
    <DataList
      data={articles}
      render={({item, index}) => (
        <DynamicArticlesListItem
          data={item}
          key={index * Math.random()}
          onModify={onModify}
          swipeableLeftFunction={onInfo}
          swipeableRightFunction={onDelete}
        />)}
    />)
}

export const ArticlesListTotal = ({ total, quantity }) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'space-between',
    }
  });
  return (
    <View style={styles.container}>
      <Heading size="l"> 
        {' Total: '}
        { currency(total)} 
      </Heading>
      <Heading size="s">
        {' Cantidad: '}
        { quantity }
      </Heading>
    </View>
  );
}

export const CategoriesCreator = ({ onChange }) => {
  const styles = StyleSheet.create({
    container: {
      padding: 6,
    }
  });
  return (
    <View style={styles.container}>
        <TextBox 
          placeholder="Categoría"
          onChangeText={onChange}
          selectTextOnFocus
        />
    </View>
  );
}

export const CategoriesList = ({
  navTo,
  articles,
  selectedCategory, 
  clearArticles,
  addArticle, 
  removeArticle, 
  modifyArticle,
}) => {
  const modalRef = useRef();
  const styles = StyleSheet.create({
    mainContainer: {
      height: '100%',
    },  
    listContainer: {
      backgroundColor: colors.background,
    },
  });

  const submitHandler = (article) => {
    addArticle(article);
    modalRef.current.close();
  }

  let list = groupBy(articles, 'category');
  list = Object.keys(list).map(key => list[key]);


  return (
      <SectionedFAB
        actions={[
          {
            value: '🧹 Limpiar',
            action: clearArticles,
          }
        ]}
        style={styles.listContainer}
        initialNumToRender={5}
        sections={list}
        keyExtractor={(item, index) => item.name + item.price + item.quantity + index}
        renderItem={({ item }) => (
          <DynamicArticlesListItem
            data={item}
            modifyArticle={modifyArticle}
            removeArticle={removeArticle}
            />
          )}
        renderSectionHeader={({section}) => (
          <CategoriesListHeader {...{ 
            selectedCategory,
            section, 
            modalRef, 
            submitHandler 
            }}/>
          )}
      />
  );
};

export const CategoriesListHeader = ({ section: { title }, modalRef, submitHandler }) => (
  <ArticlesSectionHeader>
    <Heading size="xl" flex={1} >{ title }</Heading>
    <ActionableModal ref={modalRef} buttonText="Agregar artículo" title={`Agregar artículo a ${title}`}>
      <ArticleForm onSubmit={submitHandler} selectedCategory={{ current: title}} />
    </ActionableModal>
  </ArticlesSectionHeader>
);

export const ModifyArticleModal = forwardRef(({ data, onSubmit, onClose }, ref) => (
  <Modal onClose={onClose} ref={ref} title={`Modificar Artículo`}>
    <ModifyArticleForm data={data} onSubmit={onSubmit} />
  </Modal>
));

export const ArticlesSectionHeader = ({ noHeight, ...props }) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      width: '100%',
      height: noHeight ? 0 : 80,
      paddingHorizontal: sizes.m,
      paddingTop: sizes.m,
    }
  })
  return (
    <View style={styles.container}>
      { props.children }
    </View>
  )
}

export const ArticlesHeader = ({ quantity, total, addArticle, selectedCategory, setSelectedCategory }) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%'
    }
  });
  return (
  <View style={styles.container}>
    <ArticlesListTotal total={total} quantity={quantity} />
    <CategoriesCreator onChange={setSelectedCategory} />
    <ArticleForm onSubmit={addArticle} selectedCategory={selectedCategory} />
  </View>
)}

export const Modal = forwardRef(({ title, onClose, children }, ref) => {
  return (
    <RNModal
      visible={true}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
        <Heading centered style={{ marginBottom: sizes.m }}>{ title }</Heading>
        { children }
        </View>
      </View>
    </RNModal>
  )
});

export const ActionableModal = forwardRef(({ title, buttonText, ...props}, ref) => {
  const [visible, setVisible] = useState(false);

  const imperativeMethods = () => ({
    close: () => setVisible(false),
    open: () => setVisible(true),
  });  

  useImperativeHandle(ref, imperativeMethods);
    
  return (
    <View style={{ flex: 1 }}>
      {
        buttonText && (
          <Button width="100%" height={80} onPress={() => setVisible(true)}>
            <Text>{ buttonText }</Text>
          </Button>
        )
      }
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
});

export const DynamicArticlesListItem = function DynamicArticlesListItem({ data, modifyArticle, removeArticle, ...props}) {
  const [modifierModalIsOpen, setModifierModalIsOpen] = useState(false);
  const styles = StyleSheet.create({
    initialsContainer: {
      maxWidth: 60,
      minHeight: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1000,
      backgroundColor: colors.card,
    },
    container: { 
      height: 80,
      backgroundColor: colors.background,
    }
  });
  
  const modifyArticleModalRef = useRef();

  const { id, name, initials, price, quantity, total } = {
    ...data,
    initials: getInitials(data.name),
    price: currency(data.price),
    total: currency(data.total),
  }

  return (
    <>
      <SwipeableListItem
        style={styles.container}
        rightContent={<Delete />}
        leftContent={<Pencil />}
        rightColor={colors.danger}
        leftColor={colors.secondary}
        rightPress={() => removeArticle(id)(data.total)}
        leftPress={ () => setModifierModalIsOpen(true)}
        >
          <ArticleRow>
            <Col flex={1}>
              <View style={styles.initialsContainer}>
                <Text bold sizes="m" color={colors.textMuted}>{ initials }</Text>
              </View>
            </Col>
            <Col flex={2} style={styles.info}>
              <Text style={{alignSelf: 'flex-start'}} bold >{quantity }{' '}{ name }</Text>
              <Text style={{alignSelf: 'flex-start'}} muted>{ price }</Text>
            </Col>
            <Col flex={2}>
              <Text bold size="m" >{ total }</Text>
            </Col>
        </ArticleRow>
      </SwipeableListItem>
      {
        modifierModalIsOpen 
        && <ModifyArticleModal 
            onClose={() => setModifierModalIsOpen(false)} 
            onSubmit={(modifiedArticle) => {
              modifyArticle(modifiedArticle); 
              setModifierModalIsOpen(false);
            }}
            data={data} 
            ref={modifyArticleModalRef} 
            /> 
      }
    </>
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