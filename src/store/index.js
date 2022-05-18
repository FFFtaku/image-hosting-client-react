import { createStore, applyMiddleware}  from 'redux';
import thunk from 'redux-thunk';
// 状态持久化
// import {} from 'redux-persist';

import reducers from './reducers';

let middleware = [
  thunk
];

const store =  createStore(reducers, applyMiddleware(...middleware));
export default store;
