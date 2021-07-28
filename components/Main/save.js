import React,{Component} from 'react';
import {View,Text, TextInput, Image, Button} from 'react-native';
import firebase from 'firebase';
require("firebase/firestore");
require("firebase/firebase-storage");

export  class Save extends Component{
    constructor(props){
        super(props);
        this.Navigation = this.Navigation.bind(this);
        console.log(this.props);
        this.state ={
            caption: null,
            
        };
    }
     
    Navigation = () =>{
        this.props.navigation.popToTop();
    }
    
    render(){
       
        console.log("IMAGE URI:");
        console.log(this.props.route.params.image);
        console.log("Caption");
        console.log(this.state.caption);
        uploadImage = async () => {
            const uri=this.props.route.params.image;
            
            const response = await fetch(uri);
            const blob = await response.blob();

            const task= firebase
                .storage()
                .ref()
                .child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
                .put(blob)
            const taskProgress = snapshot => {
                console.log(`transfered: ${snapshot.bytesTransferred}`);
            }
            const taskCompleted = () => {
                task.snapshot.ref.getDownloadURL().then((snapshot) =>{
                    savePostData(snapshot);
                    console.log(snapshot);
                })
                
            }
            const taskError = snapshot =>{
                console.log(snapshot);
            }
            
            task.on("state_changed",taskProgress,taskError,taskCompleted);
        }

        const savePostData = (downloadURL) => {
            captionName = this.state.caption
            firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption: this.state.caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then(this.Navigation());
        }
    return(
        <View style={{flex:1}}>
            
            <Image source={{uri:this.props.route.params.image}} style={{flex:1}}/>
            <TextInput 
                placeholder="Write a Caption"
                onChangeText = {(caption) => {
                    this.setState({
                        caption: caption
                    })
                }}
            />
            <Button title="Save Post" onPress={() => uploadImage()}/>
        </View>
    );

    
    }
}

export default Save;