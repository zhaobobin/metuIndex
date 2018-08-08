import request from '~/utils/request';
import {ENV, Storage, globalOptions} from '~/utils/utils';

export default {

  namespace: 'global',

  state: {
    status: undefined,
    currentUser: {},
    theme: Storage.get(ENV.storageTheme) || {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *register({ url, payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return request('api/register', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 200){
        yield callback(res);
      }
    },

    *token({ url, payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return request('api/token', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 200){
        Storage.set(ENV.storageToken, res.token);              //保存token
        yield callback(res);
      }
    },

    *logout({ url, payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return request('api/logout', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 200){
        yield callback(res);
      }
    },

    *post({ url, payload, callback }, { call, put }) {
      const options = globalOptions(url, payload);
      const res = yield call(
        (params) => {return request(options.url, {method: 'POST', body: params})},
        options.payload
      );
      if(res.status === 200){
        yield callback(res);
      }
    },

    *get({ url, payload, callback }, { call, put }) {
      const options = globalOptions(url, payload);
      const res = yield call(
        (params) => {return request(options.url, {method: 'GET', body: params})},
        options.payload
      );
      if(res.status === 200){
        yield callback(res);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
