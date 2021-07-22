import React, {Component} from 'react';
import {View, Button, TextInput, Text} from 'react-native';
import firebase from 'firebase';

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password : '',
            name : ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    onSignUp(){
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((result) => {
            console.log(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    render(){
        return(
            <View>
                
                <TextInput 
                    placeholder="Email"
                    onChangeText = {(email) => this.setState({email})}
                />
                <TextInput 
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText = {(password) => this.setState({password})}
                />

                <Button 
                    onPress={()=> this.onSignUp()}
                    title = "Sign In"
                />
            </View>
        )

    }
}