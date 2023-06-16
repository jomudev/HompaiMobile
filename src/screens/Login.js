import React from 'react';
import { ToastAndroid } from 'react-native';
import { Layout, Container, Button, Heading } from '../components/UI';
import Auth from '../../modules/Auth';

export default function () {

  console.log(Auth.currentUser);

  const signin = async () => {
    try {
      await Auth.signInWithGoogle();
    } catch (err) {
      ToastAndroid.show(err, ToastAndroid.LONG);
    }
  }

  return (
    <Layout centered>
      <Container style={{ padding: 8 }} centered >
        <Heading centered size="xl">Hompai</Heading>
        <Button onPress={signin} >
          Iniciar con Google
        </Button>
      </Container>
    </Layout>
  );
}