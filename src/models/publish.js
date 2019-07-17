/**
 * 内容发布 - 用于保存编辑文章的状态
 */
import Request from '@/utils/request';

export default {

  namespace: 'publish',

  state: {

    submitting: false,                    //提交状态
    publishType: '',                      //发布类型：文章、图片
    content: '',                          //发布内容
    thumb: '',                            //缩略图（可选）
  },

  effects: {
    *init({ payload }, { call, put }) {
      const res = yield call(
        (params) => {return Request('api/init', {method: 'POST', body: params})},
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
