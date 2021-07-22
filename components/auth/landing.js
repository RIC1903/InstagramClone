import React from 'react';
import {View, Text, Button} from 'react-native';

export default Landing = ({navigation}) =>{
    return (
        <View style={{flex:1, justifyContent:'center'}}>
            <Button 
            title="Register"
            onPress={()=> navigation.navigate("register")}/>
        </View>
    );
}