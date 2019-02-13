import request from '~/utils/request';
import {ENV, Storage} from '~/utils/utils';

export default {

  namespace: 'publish',

  state: {

    submitting: false,                    //提交状态
    modelType: '',                        //模型类型
    thumb: '',                            //缩略图
    category: '',                         //分类列表
    content: '',                          //文章内容
    photoList: '',                        //图片列表
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
    changeModelType(state, {payload}) {
      return {
        ...state,
        modelType: payload.modelType
      };
    },
    saveArticleContent(state, {payload}) {
      return {
        ...state,
        ...state,
        content: payload.content
      };
    },
  }
}
