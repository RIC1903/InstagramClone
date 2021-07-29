import {USER_STATE_CHANGE,USET_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE} from '../constants';
import firebase from 'firebase';



export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    // console.log(snapshot.data());
                    dispatch({ type: 'USER_STATE_CHANGE', currentUser: snapshot.data() })
                }
                else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
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
                dispatch({ type: 'USER_POSTS_STATE_CHANGE', posts })
            })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id;
                })
                // console.log(following)
                dispatch({ type: 'USER_FOLLOWING_STATE_CHANGE', following })
            })
    })
}

