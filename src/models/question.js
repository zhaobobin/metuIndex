/**
 * 问答
 */
import { Request } from "@/utils"
import { notification } from 'antd';

export default {

  namespace: 'question',

  state: {

    loading: true,                    //提交状态

    page: 1,					      // 当前页数
    per_page: 10,			      // 每页数量
    url: '',
    category: '',
    list: [],
    total: 0,
    hasMore: true,

    detail: '',

  },

  effects: {

    // 问题列表
    *list({ url, payload }, { call, put }) {
      const res = yield call(
        (params) => {return Request(url, {method: 'GET', body: params})},
        payload
      );
      yield put({
        type: 'saveList',
        payload: {
          url,
          page: payload.page,
          category: payload.category,
          data: res.data,
          clearList: payload.clearList || ''
        },
      });
      if(res.code !== 0) notification.error({message: '提示', description: res.message});

    },

  },

  reducers: {
    saveList(state, {payload}) {
      let list = payload.page === 1 ? [] : state.list;
      return {
        ...state,
        loading: false,
        url: payload.url,
        category: payload.category,
        page: payload.data.hasMore ? payload.page + 1 : payload.page,
        list: list.concat(payload.data.list),
        total: payload.data.count,
        hasMore: payload.data.hasMore
      };
    },
    saveDetail(state, {payload}) {
      return {
        ...state,
        detail: payload.detail
      };
    },
  }
}
