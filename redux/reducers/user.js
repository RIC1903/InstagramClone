import {USER_STATE_CHANGE} from "../constants/index.js";
const initialState = {
    currentUser: null
}

export const user = (state=initialState,action) => {
    console.log(action)
    switch (action.type) {
        case USER_STATE_CHANGE:
            
            return {
                ...state,
                currentUser: action.currentUser
            }
    default:
        
        return state;
    }
}