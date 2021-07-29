import React, { Component } from 'react'
import {View,Text, TextInput, FlatList, TouchableOpacity} from 'react-native';

import firebase from 'firebase';
require('firebase/firestore');

export class Search extends Component {
    constructor(props){
        super(props);
        this.state={
            users: []
        }
    }

    
    render() {
        const fetchUsers = (search) => {
            firebase.firestore()
            .collection('users')
            .where('name','>=',search)
            .get()
            .then((snapshot) => {
                let user = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                this.setState({
                    users: user
                })
            })
        }
        return (
            <View>
                <TextInput
                onChangeText = {(search) => fetchUsers(search) } placeholder="Search here"r/>
                <FlatList
                numColumns={1}
                horizontal={false}
                data={this.state.users}
                renderItem={({item})=>(
                    <TouchableOpacity
                        onPress={()=>this.props.navigation.navigate('profile',{uid: item.id})}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    
                )}
                />
            </View>
        )
    }
}

export default Search

