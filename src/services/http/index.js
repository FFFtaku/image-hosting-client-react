import request from '@/services/http/baseAxios';

function Get(url,params,config){

  // config中传入需要单独配置的另外内容，如headers等
  return request(
    url,
    {
      // method:"get", //默认为get
      params,
      ...config,
    }
  )
}

function Post(url,data,config){

  // config中传入需要单独配置的另外内容，如headers等
  return request(
    url,
    {
      method:"post",
      data,
      ...config
    }
  )
}

export {
  Get,
  Post
}