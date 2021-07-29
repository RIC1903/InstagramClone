import React, { Component } from 'react'
import {View,Text, FlatList, Button, TextInput} from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions';

class Comment extends Component {
    constructor(props){
        super(props);
        this.state = {
            comments: [],
            postId: -1,
            text: "",
            pid: null,
            users: [],
            myProps: this.props
        }
    }
    componentDidMount(){
        this.componentDidUpdate();
    }
    componentDidUpdate(){
        console.log("Entererd")
        if(this.props.route.params.postId != this.state.postId || this.props.users !=this.state.users){
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
                // console.log(comments)
                for(let i=0;i<comments.length;i++){
                    console.log("Inside man")
                    if(comments[i].hasOwnProperty('user')){
                        continue;
                    }
                    console.log(comments[i]);
                    const user = this.props.users.find(x => x.uid == comments[i].creator);
                    if(user == undefined){
                        this.props.fetchUsersData(comments[i].creator, false);
                    }
                    else{
                        comments[i].user = user
                    }
                }
                console.log(comments)
                this.setState({
                    comments: comments
                })
                console.log(this.props.users)
                this.setState({
                    // comments:comments,
                    postId: this.props.route.params.postId,
                    pid: this.props.route.params.uid,
                    users: this.props.users
                })
            })

        }
    }
    // componentDidUpdate(){
    //     function matchUserToComment(comments){
    //         for(let i=0;i<comments.length;i++){

    //             if(comments[i].hasOwnProperty('user')){
    //                 continue;
    //             }

    //             const user = this.props.user.finde(x => x.uid === comments[i].creator);
    //             if(user == undefined){
    //                 this.props.fetchUsersData(comments[i].creator, false);
    //             }
    //             else{
    //                 comment[i].user = user
    //             }
    //         }
    //         this.setState({
    //             comments: comments
    //         })
    //     }
    //     if(this.props.route.params.postId != this.state.postId){
    //         firebase.firestore()
    //         .collection('posts')
    //         .doc(this.props.route.params.uid)
    //         .collection("userPosts")
    //         .doc(this.props.route.params.postId)
    //         .collection('comments')
    //         .get()
    //         .then((snapshot) => {
    //             let comments = snapshot.docs.map(doc => {
    //                 const data = doc.data();
    //                 const id = doc.id;
    //                 return {id, ...data}
    //             })
    //             console.log(comments)
    //             matchUserToComment(comments);
    //             this.setState({
                    
    //                 postId: this.props.route.params.postId,
    //                 pid: this.props.route.params.uid,
    //                 users: this.props.user
    //             })
    //         })

    //     }
       
    // }
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
            this.setState({
                users:null
            })
            this.componentDidUpdate();
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
                        <View style={{flexDirection:'row',padding: 5}}>
                            {item.user !== undefined ? 
                            <Text style={{fontSize:16,fontWeight:'bold'}}>
                                {item.user.name}
                            </Text>
                            :null}
                            <Text style={{fontSize:16, marginLeft:10}}>{item.text}</Text>
                        </View>
                    )}
                />

            </View>
        )
    }
}

const mapStateToProps = (store) => ({
    users:store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData},dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);

