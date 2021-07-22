import React from 'react';
import {ScrollView,StyleSheet,Text,View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import  * as firebase from 'firebase'; 

const firebaseConfig = {
  apiKey: "AIzaSyCPiN1SXB_sTT7maAQJZM91YojJnCU3eng",
  authDomain: "inspired-nomad-255711.firebaseapp.com",
  databaseURL: "https://inspired-nomad-255711.firebaseio.com",
  projectId: "inspired-nomad-255711",
  storageBucket: "inspired-nomad-255711.appspot.com",
  messagingSenderId: "1046290535882",
  appId: "1:1046290535882:web:165845ee235c804b63eb33",
  measurementId: "G-7NZQS6KNZT"
};

if(firebase.apps.length===0){
  firebase.initializeApp(firebaseConfig);
}

import Landing from "./components/auth/landing.js";
import Register from "./components/auth/register.js";
const  Stack = createStackNavigator();
export default App = () =>{
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="landing">
        <Stack.Screen name="landing" component={Landing} options={{headerShown:false}}/>
        <Stack.Screen name="register" component={Register}/>
      </Stack.Navigator>
    </NavigationContainer>  
  );
};

const styles= StyleSheet.create({
  body:{
    margin: 0
  }
});
