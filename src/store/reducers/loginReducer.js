import {SET_AUTH_CODE_REMAIN_TIME} from '../actionType/loginConstant';


const initState = {
  authCodeRemainTime: null
}

export default function loginReducer(preState = initState, action) {
  let { type, data } = action;
  let newState = {...preState};

  switch(type) {
    case SET_AUTH_CODE_REMAIN_TIME:{
      // 不需要组件重新渲染
      preState.authCodeRemainTime = data;
      return preState;
    }
    default:
      return preState;

  }
}