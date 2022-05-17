import {notification} from 'antd';

const baseConfig = {
  type:'success',
  message:'message',
  description:'',
  duration:2.5,
  placement:'top'
}
function antdNotification(config){
  let combineConfig = {
    ...baseConfig,
    ...config
  }
  let {type} = combineConfig;
  delete combineConfig.type;
  notification[type](combineConfig);

}
export default antdNotification;