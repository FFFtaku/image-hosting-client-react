import axios from 'axios';

import restfulCode from './restfulCode';

// 配置的权重等级：axios库默认配置 < 自己配置的默认值 < 传入的配置值
// headers中的配置内容会累加
// 如：配置默认值中headers字段{"test":"test"}，自己传入配置headers:{"foo":"foo"}，最后会将两条header字段都加入请求中。
const instance = axios.create({
  baseURL: 'http://localhost:4000', // 设置统一的请求前缀
  timeout: 10000, // 设置统一的超时时长
  headers: {} // 所以请求设置header字段
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 自动携带token
    if (toGetTokenByLocalStorage) {
      // toGetTokenByLocalStorage()如果token不存在返回null
      config.headers.token = toGetTokenByLocalStorage('token');
      // 自定义请求头中token字段，值为'null'字符串
    }

    // 需要返回config以正常进行请求
    return config;
  },

  error => {
    // 请求拦截中很少出现异常
    // 返回reject状态的promise以便在catch捕获
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 业务需求，如果响应头中有newToken字段，需要重新存储
    if (response.headers.newToken) {
      toSetTokenByLocalStorage('token', response.headers.newToken);
    }
    // 后端返回值采用restful风格，非200状态码进入错误处理
    if (response.data.status === restfulCode['SUCCESS']) {

      return Promise.resolve(response.data)
    } else {
      // 对常见错误状态统一处理
      // if (res.data.code === restfulStatus["Identity_Failure"]) {
      //   return router.replace("/");
      // }
      // 和下面情况一样，如果不返回reject的promise，将会在then中拿到
      return Promise.reject(response.data)
    }
  },
  error => {
    // http状态码为400、500等情况时，axios会自动进入这里
    // 因为采用restful风格，一般不会返回非200以外的状态码
    // 因此通常在网络连接异常的情况下才会走这里（http超时，或tcp层都未能连接成功）

    // 需要返回reject状态的promise才会走catch，如果直接返回则走then，如果不返回在回调中将不能拿到结果
    // return Promise.reject(error)
  }
)

// 设置默认配置
// axios会自动忽略传入的config中为null的配置
const BASE_CONFIG = {
  // 默认get请求
  method: "get",
  // 配置headers，也可以在axios的默认值中配置
  headers: {},
  // url参数
  params: null,
  // 请求体载荷，get请求设置无效
  data: null
}

/**
 * @description 封装request方法，用于更方便的调用axios
 * @param {String} url url地址
 * @param {Object} config method、headers等信息都通过config传入
 */
const request = (url, config = {}) => {
  // url 必传
  if (!url) {
    throw new Error('request错误->必须传入url');
  }

  // 将BASE_CONFIG与动态传入配置结合
  let combineConfig = {
    url,
    ...BASE_CONFIG,
    // config将覆盖BASE_CONFIG中的同名设置
    ...config,
    // 保证headers可以叠加设置
    headers: {
      ...BASE_CONFIG.headers,
      ...config.headers
    }
  }

  return instance(combineConfig);
}

export default request;


/**
 * 处理异常
 * @param {*} error 
 */
// function httpErrorStatusHandle(error) {
//   // 处理异常

// }


/**
 * 对需要在网络请求中常用的操作做封装
 */

function toGetTokenByLocalStorage(tokenName) {
  let token = localStorage.getItem(tokenName);
  if (!token) {
    return null;
  }
  return token;
}

function toSetTokenByLocalStorage(tokenName, token) {
  localStorage.setItem(tokenName, token);
}

