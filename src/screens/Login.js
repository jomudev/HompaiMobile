import React from 'react';
import { ToastAndroid } from 'react-native';
import { Layout, Container, Button, Heading } from '../components/UI';
import auth from '../../modules/Auth';
const Auth = auth.getInstance();

const signin = async () => {
  try {
    await Auth.signInWithGoogle();
  } catch (err) {
    console.log(err);
    ToastAndroid.show(err, ToastAndroid.LONG);
  }
}

export default function () {
  return (
    <Layout centered>
      <Container style={{ padding: 8 }} centered >
        <Heading centered size="xl">Hompai</Heading>
        <Button onPress={ signin } >
          Iniciar con Google
        </Button>
      </Container>
    </Layout>
  );
}