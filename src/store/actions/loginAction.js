
import {SET_AUTH_CODE_REMAIN_TIME} from '../actionType/loginConstant';

function actionSetAuthCodeReaminTime(data){
  return {
    type:SET_AUTH_CODE_REMAIN_TIME,
    data
  }
}

export {
  actionSetAuthCodeReaminTime
}