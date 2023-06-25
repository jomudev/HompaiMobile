import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import MainRouter from './mainRouter';
import Auth from '../../modules/Auth';

const auth = Auth.getInstance()

export default function (props) {
  const [state, setState] = useState({
    user: auth.currentUser,
  });

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setState({user});
    });
  }, []);

  return (
    <NavigationContainer>
      {
        state.user
          ? <MainRouter />
          : <Login />
      }
    </NavigationContainer>
  );
}