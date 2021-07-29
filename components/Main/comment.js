import React, { Component } from 'react'
import {View,Text, FlatList, Button, TextInput} from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');

export class comment extends Component {
    constructor(props){
        super(props);
        this.state = {
            comments: [],
            postId: null,
            text: "",
            pid: null
        }
    }

    componentDidUpdate(){
        if(this.props.route.params.postId != this.state.postId){
            firebase.firestore()
            .collection('posts')
            .doc(this.props.route.params.uid)
            .collection("userPosts")
            .doc(this.props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                this.setState({
                    comments:comments,
                    postId: this.props.route.params.postId,
                    pid: this.props.route.params.uid
                })
            })

        }
    }
    render() {
        const onCommentSend = () => {
            console.log("Yo")
            firebase.firestore()
            .collection('posts')
            .doc(this.props.route.params.uid)
            .collection("userPosts")
            .doc(this.props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text: this.state.text
            })
        }
        return (
            <View>
                <View>
                    <TextInput
                    placeholder="Write your Comment"
                    onChangeText={(textCom) => this.setState({
                        text: textCom
                    })}
                    />
                    <Button 
                        onPress = {() => onCommentSend()}
                        title="Submit"
                    />
                </View>
                <FlatList 
                    numColumns={1}
                    horizontal={false}
                    data={this.state.comments}
                    renderItem={({item}) => (
                        <View>
                            <Text>{item.text}</Text>
                        </View>
                    )}
                />

            </View>
        )
    }
}

export default comment
