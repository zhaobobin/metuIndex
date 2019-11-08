import fetch from 'dva/fetch';
import { notification } from 'antd';
import { Base64 } from 'js-base64';
import { ENV, Storage } from '@/utils';

const codeMessage = {
  200: '请求成功',

  400: '请求失败',
  401: '用户未登录',
  402: '用户不存在',
  403: '用户密码错误',
  404: '图形验证码错误',
  405: '短信验证码错误',

  410: '手机号已注册',
  411: '用户名已注册',
  412: '邮箱已注册',

  420: '无权进行操作',

  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: '请求错误' + response.status,
    description: errortext,
  });

  const error = new Error(response.statusText);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function Request(url, options) {

  url = ENV.api_base + url

  const newOptions = options;

  if (newOptions.method === 'GET') {
    newOptions.headers = {
      'Accept': 'application/json',
      ...newOptions.headers,
    };
    let query = "";
    for(let i in options.body){
      query += i + "=" + options.body[i] + "&";
    }
    query = query.substring(0, query.length - 1);
    if(query) url = `${url}?${query}`
    delete newOptions.body;
  } else {
    newOptions.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  // HttpBasicAuth
  if(Storage.get(ENV.storage.token)) {
    newOptions.headers['Authorization'] = 'Basic ' + Base64.encode(Storage.get(ENV.storage.token) + ':'); //读取本地token
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}

export function FetchGet(url){
  let option = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  };
  return fetch(url, option)
    .then(response => response.json())
    .catch((error) => {
      return error;
    });
}
