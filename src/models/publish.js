/**
 * 内容发布 - 用于保存编辑文章的状态
 */
import { Request } from "@/utils"

export default {

  namespace: 'publish',

  state: {

    submitting: false,                    //提交状态
    publishType: '',                      //发布类型：文章、图片
    content: '',                          //文章内容
    images: '',                          //影集内容
    thumb: '',                            //缩略图（可选）
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
        images: payload.images,
        thumb: payload.thumb,
      };
    },
  }
}
