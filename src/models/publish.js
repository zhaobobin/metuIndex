/**
 * 内容发布 - 用于保存编辑文章的状态
 */
import { Request } from "@/utils"

export default {

  namespace: 'publish',

  state: {

    submitting: false,                    //提交状态
    publishType: '',                      //发布类型：文章、图片、问题、回答

    photo: {
      images: '',                          //影集内容
      thumb: '',                            //缩略图（可选）
    },

    article: {
      content: '',                          //文章内容
      thumb: '',                            //缩略图（可选）
    },
    question: {
      title: '',
      content: '',                          //问题内容
      thumb: '',                            //缩略图（可选）
      topics: '',
    },
    answer: {
      content: '',                          //回答内容
      thumb: '',                            //缩略图（可选）
    }
  },

  effects: {



  },

  reducers: {
    changePublishType(state, {payload}) {
      return {
        ...state,
        publishType: payload.publishType
      };
    },
    saveArticle(state, {payload}) {
      return {
        ...state,
        article: {
          ...state.article,
          ...payload,
        }
      };
    },
    savePhoto(state, {payload}) {
      return {
        ...state,
        photo: {
          ...state.photo,
          ...payload,
        }
      };
    },
    saveQuestion(state, {payload}) {
      return {
        ...state,
        question: {
          ...state.question,
          ...payload,
        }
      };
    },
    saveAnswer(state, {payload}) {
      return {
        ...state,
        answer: {
          ...state.answer,
          ...payload,
        }
      };
    },

  }
}
