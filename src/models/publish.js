import request from '~/utils/request';
// import {ENV, Storage} from '~/utils/utils';

export default {

  namespace: 'publish',

  state: {

    submitting: false,                    //提交状态
    publishType: '',                      //发布类型：文章、图片
    content: '',                          //发布内容
    thumb: '',                            //缩略图（可选）
    currentPhoto: 0,                      //默认当前展示的图片
    photoList: '',                        //图片保存列表
  },

  effects: {
    *init({ payload }, { call, put }) {
      const res = yield call(
        (params) => {return request('api/init', {method: 'POST', body: params})},
        payload
      );
      if(res.status === 1){
        yield put({
          type: 'changeAppInfo',
          payload: res,
        });
      }
    },

  },

  reducers: {
    changePublishType(state, {payload}) {
      return {
        ...state,
        publishType: payload.publishType
      };
    },
    saveArticleContent(state, {payload}) {
      return {
        ...state,
        content: payload.content,
        thumb: payload.thumb,
      };
    },
    savePhotoContent(state, {payload}) {
      return {
        ...state,
        content: payload.content,
        thumb: payload.thumb,
      };
    },
  }
}
