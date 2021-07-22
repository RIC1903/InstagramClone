import React,{Component} from 'react';
import {View,Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab=createBottomTabNavigator();

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUser} from '../redux/actions/index.js';


import Feed from './Main/feed.js';
import Profile from './Main/profile';

const EmptyScreen =()=>{
    return(null);
}

export class Main extends Component{
    componentDidMount(){
        this.props.fetchUser();
    }
    render(){
       
        return(
            <Tab.Navigator initialRouteName="feed">
                <Tab.Screen name="feed" component={Feed}
                options={{
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26}/>
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
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser},dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
