import {USER_STATE_CHANGE,USET_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE,USERS_DATA_STATE_CHANGE,CLEAR_DATA,USERS_LIKES_STATE_CHANGE} from '../constants';
import firebase from 'firebase';

export function clearData(){
    return ((dispatch) => {
        dispatch({type: 'CLEAR_DATA'})
    })
}
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
                for(let i =0;i<following.length; i++){
                    dispatch(fetchUsersData(following[i],true));
                }
            })
    })
}

export function fetchUsersData(uid, getPosts){
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        console.log(found)
        if(!found){
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let user = snapshot.data();
                    user.uid=snapshot.id;
                    dispatch({ type: 'USERS_DATA_STATE_CHANGE', user})
                    if(getPosts){
                        dispatch(fetchUsersFollowingPosts(uid))
                    }
                    
                }
                else {
                    console.log('does not exist')
                }
            })
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    const userId=uid;
    return ((dispatch,getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                console.log("The uid is", uid)
                console.log("Snapshot is \n",snapshot)
                // console.log({snapshot,uid});
                // const uid = snapshot.query.EP.path.segments[1];
                const uid=userId;
                const user = getState().usersState.users.find(el => el.uid === uid);
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data,user }
                })
                console.log("Yo yo")
                console.log(posts.user)
                for(let i=0;i<posts.length;i++){
                    dispatch(fetchUsersFollowingLikes(uid,posts[i].id));
                }
                dispatch({ type: 'USERS_POSTS_STATE_CHANGE', posts,uid })
                console.log(getState())
            })
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    
    const userId=postId;
    return ((dispatch,getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                
                const postId=userId;
                let currentUserLike = false;
                if(snapshot.exists){
                    
                    currentUserLike = true;
                }
                firebase.firestore()
                .collection("posts")
                .doc(uid)
                .collection("userPosts")
                .doc(postId)
                .collection("likes")
                .get()
                .then((snapshot) => {
                    
                    let likes=snapshot.docs.length
                    console.log(snapshot.docs.legnth)
                    dispatch({ type: 'USERS_LIKES_STATE_CHANGE', postId,currentUserLike, likes})
                    
                })
                
                
            })
            
    })
}