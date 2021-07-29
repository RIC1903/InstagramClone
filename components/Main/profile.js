import React,{Component} from 'react';
import {View,Text, Image, FlatList, StyleSheet, Button} from 'react-native';

import firebase from 'firebase';
require('firebase/firestore');
import {connect} from 'react-redux';
import { user } from '../../redux/reducers/user';

class Profile extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            userPosts: [],
            user:null,
            userId: null,
            following: false,
            followArr: []
        }
    }
    
    componentDidMount() {
        this.setState({
            userId:this.props.route.params.uid
        })
       
        const posts = this.props.posts;
        const currentUser = this.props.currentUser;
        if(this.props.route.params.uid === firebase.auth().currentUser.uid){
            console.log("Not same user");
            this.setState({
                user: currentUser,
                userPosts: posts
                
            })
        }
        else{
            console.log("Here");
            firebase.firestore()
            .collection("users")
            .doc(this.props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    this.setState({
                        user:snapshot.data()
                    })
                }
                else {
                    console.log('does not exist')
                }
            })

            firebase.firestore()
            .collection("posts")
            .doc(this.props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                // console.log(posts)
                this.setState({
                    userPosts:posts
                })
            })

        }
        console.log(this.props.following)
        this.state.followArr=this.props.following
        if(this.props.following.indexOf(this.props.route.params.uid) > -1){
            this.setState({
                following: true,
            })
        }
        if(this.props.following.indexOf(this.props.route.params.uid) <0){
            this.setState({
                following: false,
            })
        }
        
    }
    componentDidUpdate(){
        
        if(this.props.route.params.uid != this.state.userId && this.state.userId!=null || this.props.following != this.state.followArr){
            this.componentDidMount();
        }
    }
    
    render(){
        const onFollow = () => {
            console.log("Following");
            
            firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(this.state.userId)
            .set({})
        }
        const onUnfollow = () => {
        
            console.log("Unfollowing");
            firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(this.state.userId)
            .delete()
        }
        if(this.state.user === null){
            return(
                <View></View>
            );
        } 
    return(
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text>{this.state.user.name}</Text>
                <Text>{this.state.user.email}</Text>

                {this.state.userId !== firebase.auth().currentUser.uid ? (
                    <View>
                        {this.state.following ? (
                            <Button 
                                title="Unfollow"
                                onPress= {() => onUnfollow()}
                            />
                        ):(
                            <Button 
                                title="Follow"
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ):null}
            </View>
            <View style={styles.galleryContainer}>
                <FlatList 
                    numColumns={3}
                    horizontal={false}
                    data={this.state.userPosts}
                    renderItem={({item}) => (
                        <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image}
                            source={{uri: item.downloadURL}}
                        />
                        </View>
                    )}
                />
            </View>
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
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps,null)(Profile);
