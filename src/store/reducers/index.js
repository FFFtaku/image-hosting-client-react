import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import workReducer from './workReducer';

export default combineReducers({
    login:loginReducer,
    work:workReducer
});