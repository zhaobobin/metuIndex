import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import {ENV, Storage, Request} from '@/utils';

export default {

  namespace: 'global',

  state: {

    loading: true,

    isAuth: false,
    lastTel: Storage.get(ENV.storage.lastTel) || '',
    currentUser: '',                                  //当前用户信息
    profileUser: '',                                     //其他用户信息

    signModalVisible: false,                          //登录modal的显示状态
    signTabKey: '',                                   //登录modal中tab的默认key

    theme: Storage.get(ENV.storage.theme) || {},      // 主题
    readModel:  Storage.get(ENV.readModel) || 'black',  // 阅读模式
  },

  effects: {

    *register({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/user/register', {method: 'POST', body: params})},
        payload
      );
      if(res.code === 0){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            currentUser: res.data.currentUser,
          }
        });
        Storage.set(ENV.storage.token, res.data.token);              //保存token
      }
      yield callback(res);
    },

    *login({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/user/login', {method: 'POST', body: params})},
        payload
      );
      if(res.code === 0){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            currentUser: res.data.detail,
          }
        });
        Storage.set(ENV.storage.lastTel, payload.mobile);              //保存token
        Storage.set(ENV.storage.token, res.data.token);              //保存token
      }
      yield callback(res);
    },

    *token({ payload }, { call, put }) {

      //没有本地存储，不校验token接口
      if(Storage.get(ENV.storage.token)) {

        const res = yield call(
          (params) => {return Request('/user/token', {method: 'POST', body: params})},
          payload
        );

        if(res.code === 0){
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

      Storage.remove(ENV.storage.token);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          loading: false,
          isAuth: false,
          currentUser: '',
        }
      });
      // yield put(routerRedux.push({ pathname: '/' }));

      // const res = yield call(
      //   (params) => {return Request('/user/logout', {method: 'POST', body: params})},
      //   payload
      // );
      // if(res.code === 0){
      //   yield put({
      //     type: 'changeLoginStatus',
      //     payload: {
      //       isAuth: false,
      //       currentUser: '',
      //     },
      //   });
      //   Storage.remove(ENV.storage.token);
      // }
    },

    *userinfo({ url, payload }, { call, put }) {
      const res = yield call(
        (params) => {return Request(url, {method: 'GET', body: params})},
        payload
      );
      if(res.code === 0){
        yield put({
          type: 'changeProfileUser',
          payload: res.data,
        });
      }else{
        yield put(routerRedux.push({ pathname: '/404' }));
      }
    },

    // 帐户详情
    *accountDetail({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return Request('/user', {method: 'POST', body: params})},
        payload
      );
      if(res.code === 0){
        yield callback(res);
        yield put({
          type: 'changeCurrentUser',
          payload: res.data,
        });
      }else{
        yield put(routerRedux.push({ pathname: '/404' }));
      }
    },

    *request({ url, method, payload, callback }, { call, put }) {

      let res, exp = payload.exp, storage = Storage.get(url);

      if(exp && storage){
        res = storage;
      }else{
        res = yield call(
          (params) => {return Request(url, {method: method || 'POST', body: params})},
          payload
        );
        if(res.code === 0 && exp) Storage.set(url, res);
      }

      //登录过期等
      if(res.code === 401){
        Storage.remove(ENV.storage.token);              //删除token
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

  },

  reducers: {
    changeLoading(state, {payload}){
      return {
        ...state,
        loading: payload
      }
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
    changeProfileUser(state, { payload }) {
      return {
        ...state,
        profileUser: payload,
      };
    },
    changeCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: Object.assign(state.currentUser, payload),
      };
    },
    changeSignModal(state, { payload }) {
      return {
        ...state,
        signModalVisible: payload.signModalVisible,
        signTabKey: payload.signTabKey,
      };
    },
    changeReadModel(state, { payload }) {
      return {
        ...state,
        readModel: payload.readModel,
      };
    },
  },

};
