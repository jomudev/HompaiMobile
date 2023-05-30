import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ToastAndroid, View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Database from './modules/database';

export default function App() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');

  const errorMessages = { 
    minimumPasswordRequirements: "🛡️Requisitos mínimos para la contraseñas\n8 caracteres\n1 número\n1 letra minúscula\n1 letra mayúscula\n1 número\nUn carácter no alfanumérico ej. #$%*\nNo tener espacios en blanco",
    emailInvalidFormat: "🤔 correo no válido, verifica nuevamente",
    passwordInvalidFormat: "🤔 contraseña no válido, verifica nuevamente",
    signInCancelled: "Has cancelado el inicio de sesión 🫠",
    invalidData: "🥴Los datos no son válidos.",
    waiting: "Esperemos un momento... 😒",
    googlePlayServicesNotAvailable: "Parece que los servicios de Google no están disponibles 🤯",
    unknown: "Tal parece que algo salió mal... 🧐 intenta de nuevo",
    passwordNotMatch: "😬 Las contraseñas no coinciden",
    userNotFound: "Más despacio velocista🚴 no encontramos tu usuario, verifica nuevamente",
    emailAlreadyInUse: "😅 Ya hay un usuario con ese correo",
  }
  
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastAndroid.show(errorMessages.signInCancelled, ToastAndroid.LONG);
      } else if (err.code === statusCodes.IN_PROGRESS) {
        ToastAndroid.show(errorMessages.waiting, ToastAndroid.LONG);
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ToastAndroid.show(errorMessages.googlePlayServicesNotAvailable, ToastAndroid.LONG);
      } else {
        ToastAndroid.show(errorMessages.unknown, ToastAndroid.LONG);
      }
    }
  };
  
  const validateEmail = (emailToValidate) => {
    if (!emailToValidate) {
      return false;
    }
    const isEmailValid = emailToValidate.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm);
    return isEmailValid && isEmailValid.length === 1;
  }

  const validatePassword = (passwordToValidate) => {
    if (!passwordToValidate) {
      return false;
    }
    const isPasswordValid = passwordToValidate.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm);
    return isPasswordValid;
  }


  const verifyEmailRealTime = () => {
    if (!email) {
      return null;
    }
    if (email.length >= 4 && !validateEmail(email)) {
      return <Text style={styles.errorMessage}>{errorMessages.emailInvalidFormat}</Text>;
    }
  }

  const verifyPasswordRealTime = () => {
    if (!newPassword) {
      return null;
    }
    if (!validatePassword(newPassword) && newPassword.length >= 4) {
      return <Text style={styles.errorMessage}>{errorMessages.minimumPasswordRequirements}</Text>;
    } 
  }

  const confirmPasswordRealTime = () => {
    if (!confirmPassword) {
      return null;
    }
    if (confirmPassword.length > 1 && confirmPassword !== newPassword ) {
      return <Text style={styles.errorMessage}>{errorMessages.passwordNotMatch}</Text>;
    }
  }

  const signInWithEmailAndPassword = async () => {
    try {
      if (!validateEmail(email)) {
        ToastAndroid.show(errorMessages.emailInvalidFormat, ToastAndroid.LONG);
        return;
      }
      if (!validatePassword(newPassword)) {
        ToastAndroid.show(errorMessages.passwordInvalidFormat, ToastAndroid.LONG);
        return;
      }
      if (newPassword !== confirmPassword) {
        ToastAndroid.show(errorMessages.passwordNotMatch, ToastAndroid.LONG);
        return;
      }
      const user = {
        email,
        password: newPassword,
        displayName: null,
        phoneNumber: null,
        photoURL: null,
      };
      const res = await Database.createUser(user);
      console.log(res);
    } catch (err) {
      const errorsCode = {
        "auth/user-not-found": errorMessages.userNotFound,
        "auth/email-already-in-use": errorMessages.emailAlreadyInUse,
      };
      console.error(err.stack);
      ToastAndroid.show(errorsCode[err.code] || errorMessages.unknown, ToastAndroid.LONG);
    }
  };

  const signIn = {
    google: signInWithGoogle,
    facebook: () => console.log("sing in with facebook"),
    emailAndPassword: signInWithEmailAndPassword,
  }

  return (
    <View style={styles.container}>
    <StatusBar style="auto" />
      <Text style={styles.appTitle}>
        Hompai
      </Text>
      <TextInput 
        style={styles.textInput} 
        onChangeText={text => setEmail(text)}
        textContentType='emailAddress'
        placeholder="johndoe@gmail.com"
        />
      {
        verifyEmailRealTime()
      }
      <TextInput 
        style={styles.textInput} 
        onChangeText={text => setNewPassword(text)} 
        secureTextEntry 
        placeholder="nueva contraseña" 
        textContentType='newPassword' 
        />
      {
        verifyPasswordRealTime()
      }
      <TextInput 
        style={styles.textInput} 
        onChangeText={text => setConfirmPassword(text)} 
        secureTextEntry 
        placeholder="confirmar contraseña" 
        textContentType='newPassword' 
        />
        {
          confirmPasswordRealTime()
        }
      <TouchableOpacity style={[styles.button, styles.signInButton]}>
        <Text style={styles.buttonText} onPress={signIn["emailAndPassword"]}>Crear Usuario</Text>
      </TouchableOpacity>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={signIn["google"]} >
          <Text style={styles.buttonText} >Iniciar Sesión con Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={signIn["facebook"]}>
          <Text style={styles.buttonText}>Iniciar Sesión con Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: '20%',
    marginBottom: '15.93%',
  },
  textInput: {
    marginBottom: 16,
    backgroundColor: "#FFF3F2",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: "52%",
  },
  buttons: {
    marginTop: '15.93%',
  },
  signInButton: {
    backgroundColor: '#F7E8E7',
    marginTop: 16,
  },  
  buttonText: {
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  button: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    width: "52%",
  },
  errorMessage: { 
    color: "red",
    width: '52%',
    fontWeight: "bold",
  }
});