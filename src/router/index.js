import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import MainRouter from './mainRouter';
import Auth from '../../modules/Auth';

const auth = Auth.getInstance();

export default function (props) {

  return (
    <NavigationContainer>
      <MainRouter />
    </NavigationContainer>
  );
}