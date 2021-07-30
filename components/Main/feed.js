import React,{Component} from 'react';
import {View,Text, Image, FlatList, StyleSheet, Button} from 'react-native';

import firebase from 'firebase';
require('firebase/firestore');
import {connect} from 'react-redux';
import { user } from '../../redux/reducers/user';

class Feed extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            posts: [],
            usersLoaded: 0,
            uid: null
        }
    }
    componentDidMount(){
        
        if(this.props.usersFollowingLoaded == this.props.following.length && this.props.following.length!==0){
            console.log("updating posts")
            
            this.props.feed.sort((x,y) => {
                return x.creation - y.creation;
            })
            this.setState({
                posts:this.props.feed,
                usersLoaded: this.props.usersFollowingLoaded
            })

        }
    }
    componentDidUpdate(){
        
        console.log("Heheh",this.props.usersFollowingLoaded, this.state.usersLoaded)
        
        if(this.props.usersFollowingLoaded !== this.state.usersLoaded || this.props.feed!=this.state.posts ){
            
            console.log(this.props.usersFollowingLoaded,this.props.following.length)
            if(this.props.usersFollowingLoaded == this.props.following.length && this.props.following.length!==0){
                
                
                this.props.feed.sort((x,y) => {
                    return x.creation - y.creation;
                })
                this.setState({
                    posts:this.props.feed,
                    usersLoaded: this.props.usersFollowingLoaded
                })
                console.log("updating posts", this.props.feed[0])
            }   
        }
        
    }
    
    render(){

 
    const onLikePress = (userId,postId) => {
        
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .set({})

        this.componentDidUpdate()
    }
    const onDislikePress = (userId,postId) => {
        firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .delete()

        this.componentDidUpdate()
    }

    
    
    return(
            <View style={styles.galleryContainer}>
                <FlatList 
                    numColumns={1}
                    horizontal={false}
                    data={this.state.posts}
                    renderItem={({item}) => (
                        <View style={styles.imageContainer}>
                            <Text style={styles.container}>{item.user.name}</Text>
                        <Image 
                            style={styles.image}
                            source={{uri: item.downloadURL}}
                        />
                        {item.currentUserLike ? (
                            <Button 
                                title="Dislike"
                                onPress={()=>onDislikePress(item.user.uid,item.id,item)}
                            />
                        ) : (
                            <Button 
                                title="Like"
                                onPress={()=>onLikePress(item.user.uid,item.id)}
                            />
                        )}
                        <Text>{item.likes} likes</Text>
                         
                        <Text
                            onPress={() => this.props.navigation.navigate('comment',
                                {postId: item.id, uid:item.user.uid}
                            )}>
                                View Comments.
                        </Text>
                        
                        </View>
                    )}
                />
            </View>
        
    );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop: 40
    },
    infoContainer: {
        margin: 10,

    },
    galleryContainer: {
        flex: 1
    },
    imageContainer: {
        flex: 1/3
    },
    image: {
        flex:1,
        aspectRatio: 1/1,
        borderWidth: 3,
        borderColor: 'white'
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps,null)(Feed);
