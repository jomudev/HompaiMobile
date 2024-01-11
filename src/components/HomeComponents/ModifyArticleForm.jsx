import { useRef } from 'react';
import { TextInput } from 'react-native';
import { Text, Row, Col, Button } from '../UI';

const ModifyArticleForm = ({ data, onSubmit }) => {
  const modifiedData = useRef(data);

  const submit = () => {
    return onSubmit(modifiedData);
  }

  return (
    <>
    <Row>
      <Col flex={1}>
        <Text bold muted>Nombre</Text>
        <TextInput 
          placeholder="_"
          autoFocus
          defaultValue={data.name}
          onChangeText={(text) => modifiedData.current.name = text}
          />
      </Col>
      <Col flex={1}>
        <Text bold muted >Precio</Text>
        <TextInput 
          placeholder={"L 0.00"}
          defaultValue={currency(data.price)}
          onChangeText={(text) => modifiedData.current.price = text}
          selectTextOnFocus
          />
      </Col>
      <Col flex={1}>
        <Text bold muted >Cantidad</Text>
        <TextInput 
          placeholder={"_"}
          defaultValue={data.quantity.toString()}
          onChangeText={(text) => modifiedData.current.quantity = text}
          selectTextOnFocus
          />
      </Col>
      <Col flex={1}>
        <Text bold muted>Categoría</Text>
        <TextInput 
          placeholder="_"
          defaultValue={data.category}
          onChangeText={(text) => modifiedData.current.category = text}
          />
      </Col>
    </Row>
    <Button onPress={submit}>
        <Text Bold>Modificar</Text>
      </Button>
    </>
  );
}

export default ModifyArticleForm;