import {
  INSERT_OPEN_RESOURCE,
  SET_CURRENT_OPEN,
  REMOVE_RESOURCE_OPEN} from '../actionType/workConstant';

const initState = {
  currentOpenResource:[

  ],
  currentOpen:null
}

export default function workReducer(preState=initState, action){
  let {type, data} = action;
  let newState = {...preState};

  switch (type){
    case INSERT_OPEN_RESOURCE:{
      newState.currentOpenResource.push(data);
      return newState;
    }
    case SET_CURRENT_OPEN:{
      newState.currentOpen = data;
      return newState;
    }
    case REMOVE_RESOURCE_OPEN:{
      newState.currentOpenResource.splice(data, 1);
      return newState;
    }
    default:
      return preState;
  }
}