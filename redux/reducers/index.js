import {combineReducers} from 'redux';
import {user} from './user.js';

const Reducers = combineReducers({
    userState: user
})

export default Reducers;