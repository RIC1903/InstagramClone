import React,{Component} from 'react';
// import {View,Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
const Tab=createMaterialBottomTabNavigator();

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser,fetchUserPosts} from '../redux/actions/index.js';


import Feed from './Main/feed.js';
import Profile from './Main/profile';
import Search from './Main/search';

const EmptyScreen =()=>{
    return(null);
}

export class Main extends Component{
    componentDidMount(){
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }
    render(){
       
        return(
            <Tab.Navigator initialRouteName="feed" labeled={false}>
                <Tab.Screen name="feed" component={Feed}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="search" component={Search}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="addcontainer" component={EmptyScreen}
                listeners={({ navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("add")
                    }
                })}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="plus-box-outline" color={color} size={26}/>
                    )
                }}/>
                <Tab.Screen name="profile" component={Profile}
                listeners={({ navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("profile",{uid: firebase.auth().currentUser.uid})
                    }
                })}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                    )
                }}/>
            </Tab.Navigator>
            
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser,fetchUserPosts},dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
