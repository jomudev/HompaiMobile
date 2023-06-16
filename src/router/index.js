import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import MainRouter from './mainRouter';
import Auth from '../../modules/Auth';

export default function (props) {
  const [user, setUser] = useState(Auth.currentUser);

  useEffect(() => {
    const subscriber = Auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => subscriber;
  }, []);

  return (
    <NavigationContainer>
      {
        user
          ? <MainRouter />
          : <Login />
      }
    </NavigationContainer>
  );
}