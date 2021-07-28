import React,{Component} from 'react';
import {View,Text, Image, FlatList, StyleSheet} from 'react-native';

import {connect} from 'react-redux';

class Profile extends Component{
    
    constructor(props){
        super(props)

    }
    render(){
        const posts = this.props.posts;
        const currentUser = this.props.currentUser;
    return(
        <View style={styles.container}>
            <Text>{currentUser.name}</Text>
            <Text>{currentUser.email}</Text>
        </View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 40
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})

export default connect(mapStateToProps,null)(Profile);
