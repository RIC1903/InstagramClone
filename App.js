import React,{Component} from 'react';
import {ScrollView,StyleSheet,Text,View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import  * as firebase from 'firebase'; 
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

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
  firebase.firestore().settings({ experimentalForceLongPolling: true }); 
}

import Landing from "./components/auth/landing.js";
import Register from "./components/auth/register.js";
import Main from "./components/Main.js";

const  Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      loaded: false,

    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else{
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render(){
    const {loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{flex:1, justifyContent:'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if(!loggedIn){
      return(
        <NavigationContainer>
          <Stack.Navigator initialRouteName="landing">
            <Stack.Screen name="landing" component={Landing} options={{headerShown:false}}/>
            <Stack.Screen name="register" component={Register}/>
          </Stack.Navigator>
        </NavigationContainer>  
      );
    }
    return(
      <Provider store={store}>
      <Main />
      </Provider>
    );
  }
}


export default App;