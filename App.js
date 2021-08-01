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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN_NAME",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "from your firebase console",
  appId: "YOUR_APP_ID",
  measurementId: "from your firebase console"
};

if(firebase.apps.length===0){
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ experimentalForceLongPolling: true }); 
}

import Landing from "./components/auth/landing.js";
import Register from "./components/auth/register.js";
import Login from "./components/auth/login";
import Main from "./components/Main.js";
import Add from './components/Main/add.js';
import Save from './components/Main/save.js';
import Comment from './components/Main/comment';

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
            <Stack.Screen name="login" component={Login}/>
          </Stack.Navigator>
        </NavigationContainer>  
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator intialRouteName="main">
            <Stack.Screen name="main" component={Main}/>
            <Stack.Screen name="add" component={Add} options={{headerShown:false}}/>
            <Stack.Screen name="save" component={Save} options={{headerShown:false}}/>
            <Stack.Screen name="comment" component={Comment} options={{headerShown:false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      
      </Provider>
    );
  }
}


export default App;