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
            usersLoaded: 0
        }
    }
    
    // componentDidMount() {
    //     let posts = []
    //     console.log("Here boi");
    //     console.log(this.props.usersLoaded,this.props.following.length)
    //     if(this.props.usersLoaded == this.props.following.length){
    //         console.log("updating posts")
    //         for (let i=0;i<this.props.following.length;i++){
    //             const user = this.props.users.find(el => el.uid === this.props.following[i]);
    //             if(user != undefined){
    //                 posts= [...posts, ...user.posts];
    //             }
    //         }
    //         posts.sort((x,y) => {
    //             return x.creation - y.creation;
    //         })

    //         this.setState({
    //             posts:posts,
    //             usersLoaded: this.props.usersLoaded
    //         })
    //     }
 
        
    // }
    componentDidUpdate(){
        console.log("Heheh",this.props.usersLoaded, this.state.usersLoaded)
        if(this.props.usersLoaded !== this.state.usersLoaded){
            console.log("Called");
            let posts = []
            console.log("Here boi");
            console.log(this.props.usersLoaded,this.props.following.length)
            if(this.props.usersLoaded == this.props.following.length){
                console.log("updating posts")
                for (let i=0;i<this.props.following.length;i++){
                    const user = this.props.users.find(el => el.uid === this.props.following[i]);
                    if(user != undefined){
                        posts= [...posts, ...user.posts];
                    }
                }
                posts.sort((x,y) => {
                    return x.creation - y.creation;
                })
    
                this.setState({
                    posts:posts,
                    usersLoaded: this.props.usersLoaded
                })
            }
        }
    }
    
    render(){

        
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
    users: store.usersState.users,
    usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps,null)(Feed);
