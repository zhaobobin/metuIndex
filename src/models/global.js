import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import Request from '@/utils/request';
import Storage from '@/utils/storage';
import ENV from '@/config/env';

export default {

  namespace: 'global',

  state: {

    loading: false,

    isAuth: false,
    status: undefined,
    lastTel: Storage.get(ENV.storageLastTel) || '',
    currentUser: '',                                  //当前用户信息
    roleList: [],                                     //角色列表

    signModalVisible: false,                          //登录modal的显示状态
    signTabKey: '',                                   //登录modal中tab的默认key

    theme: Storage.get(ENV.storageTheme) || {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

    },
  },

  effects: {
    *init({ payload }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/api/init', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 1){
        yield put({
          type: 'changeAppInfo',
          payload: res.data,
        });
      }
    },
    *register({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/api/v1/user/register', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 1){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            currentUser: res.data.currentUser,
          }
        });
        Storage.set(ENV.storageLastTel, payload.mobile);
        Storage.set(ENV.storageToken, res.data.token);              //保存token
      }
      yield callback(res);
    },

    *login({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/api/v1/user/login', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 1){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            currentUser: res.data.currentUser,
          }
        });
        Storage.set(ENV.storageLastTel, payload.mobile);
        Storage.set(ENV.storageToken, res.data.token);              //保存token
      }
      yield callback(res);
    },

    *token({ payload, callback }, { call, put }) {

      //没有refreshToken 不校验token接口
      if(payload.refreshToken) {

        const res = yield call(
          (params) => {return Request('/api/v1/user/current', {method: 'POST', body: params})},
          payload
        );
        yield callback(res);

        if(res.status === 1){
          Storage.set(ENV.storageToken, res.data.token);               //保存token
          yield put({
            type: 'changeLoginStatus',
            payload: {
              loading: false,
              isAuth: true,
              currentUser: res.data,
            }
          });
        }else{
          yield put({
            type: 'changeLoginStatus',
            payload: {
              loading: false,
              isAuth: false,
              currentUser: '',
            }
          });
        }

      }else{
        yield put({ type: 'changeLoading', payload: false });
      }

    },

    *logout({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/api/v1/user/logout', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 1){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            isAuth: false,
            currentUser: '',
          },
        });
        Storage.remove(ENV.storageToken);
      }
    },

    *post({ url, payload, callback }, { call, put }) {

      let res, exp = payload.exp, storage = Storage.get(url);

      if(exp && storage){
        res = storage;
      }else{
        res = yield call(
          (params) => {return Request(url, {method: 'POST', body: params})},
          payload
        );
        if(res.status === 1 && exp) Storage.set(url, res);
      }

      //登录过期等
      if(res.status === 9){
        Storage.remove(ENV.storageToken);              //删除token
        notification.error({
          message: '提示',
          description: res.message
        });
        yield put({
          type: 'changeLoginStatus',
          payload: {
            isAuth: false,
            userInfo: '',
          }
        });
        yield put(routerRedux.push({ pathname: '/' }));
      }else{
        yield callback(res);
      }

    },

    *get({ url, payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request(url, {method: 'GET', body: params})},
        payload
      );
      yield callback(res);
    },
  },

  reducers: {
    changeAppInfo(state, { payload }) {
      return {
        ...state,
        loading: false,
        isAuth: !!payload.currentUser,
        roleList: payload.roleList,
        category: payload.category,
        currentUser: payload.currentUser,
      };
    },
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
        isAuth: payload.isAuth,
        currentUser: payload.currentUser,
        token: payload.token,
      };
    },
    changeSignModal(state, { payload }) {
      return {
        ...state,
        signModalVisible: payload.signModalVisible,
        signTabKey: payload.signTabKey,
      };
    },
  },

};
