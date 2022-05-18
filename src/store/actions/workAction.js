import {
  INSERT_OPEN_RESOURCE,
  SET_CURRENT_OPEN,
  REMOVE_RESOURCE_OPEN} from '../actionType/workConstant';

function actionInsertCurrentOpenResource(data){
  return {
    type:INSERT_OPEN_RESOURCE,
    data
  }
}

function actionSetCurrentOpen(data){
  return {
    type:SET_CURRENT_OPEN,
    data
  }
}

function actionRemoveResourceOpen(data){
  return {
    type:REMOVE_RESOURCE_OPEN,
    data
  }
}
export {
  actionInsertCurrentOpenResource,
  actionSetCurrentOpen,
  actionRemoveResourceOpen
}