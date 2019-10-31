/**
 * oss 文件上传
 key生成规则：用户id/保存类别_当前时间戳.图片类型
 let key = this.props.global.currentUser._id + '/photo_' + new Date().getTime() + '.' + file.name.split('.')[1];
 */
import { notification } from 'antd'
import { ENV, Storage, Request, FetchGet } from '@/utils'

const getClient = function (data) {
  return new window.OSS.Wrapper({
    region: data.region,
    bucket: data.bucket,
    accessKeyId: data.credentials.AccessKeyId,
    accessKeySecret: data.credentials.AccessKeySecret,
    stsToken: data.credentials.SecurityToken
  })
}
//base64转Blob
const toBlob = function (urlData, fileType) {
  let bytes = window.atob(urlData),
    n = bytes.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bytes.charCodeAt(n)
  }
  return new Blob([u8arr], {type: fileType})
}

export default {
  namespace: 'oss',

  state: {
    loading: false,
    submitting: false,
    exif: ''
  },

  effects: {

    // 列表
    *list({payload, callback}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      })
      const res = yield call(
        (params) => {
          return Request('/api/PhotoList', {method: 'POST', body: params,})
        },
        {payload}
      )
      yield callback(res)
      yield put({
        type: 'changeList',
        payload: res,
      })
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },

    // 详情
    *detail({payload, callback}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      })
      const res = yield call(
        (params) => {
          return Request('/api/FileOssEdit', {method: 'POST', body: params,})
        },
        {}
      )
      yield callback(res)
      yield put({
        type: 'changeDetail',
        payload: res,
      })
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },

    // 源数据
    *exif({payload, callback}, {call, put}) {

      let url = payload.url + '?x-oss-process=image/info';

      const exif = yield FetchGet(url)

      yield callback(exif);

    },

    // 上传
    *upload({payload, callback}, {call, put}) {
      let res,
        ossToken = Storage.get(ENV.ossToken, 7200)
      if(ossToken){
        res = ossToken
      } else {
        res = yield call(
          (params) => {return Request(`${ENV.api_base}/oss/token`, {method: 'POST', body: params})},
          {}
        )
        Storage.set(ENV.ossToken, res)
      }

      if (res.code === 0) {
        let client = getClient(res.data)
        client.multipartUpload(payload.key, payload.file, {})
          .then(function (r) {
            let url = r.res.requestUrls[0].split('?')[0]
            url = url.replace('metuwang.oss-cn-qingdao.aliyuncs.com', 'photo.metuwang.com')
            return callback(url)
          })
          .catch(function (err) {
            notification.error({
              message: '上传失败！',
              //description: err,
            })
          })
      } else {
        notification.error({
          message: res.message,
        })
      }
    },

    *uploadBase64({payload, callback}, {call, put}) {
      const res = yield call(
        (params) => {return Request('/api/FileOssEdit', {method: 'POST', body: params})},
        {}
      )
      if (res.code === 0) {

        let client = getClient(res.data)

        let dataUrl = payload.base64
        let base64 = dataUrl.split(',')[1]
        let fileType = dataUrl.split(';')[0].split(':')[1]
        let blob = toBlob(base64, fileType)
        let reader = new FileReader()

        reader.readAsArrayBuffer(blob)
        reader.onload = function (event) {
          // arrayBuffer转Buffer
          let buffer = new window.OSS.Buffer(event.target.result)
          client.put(payload.key, buffer).then(function (r) {
            let url = r.res.requestUrls[0].split('?')[0]
            url = url.replace('metuwang.oss-cn-qingdao.aliyuncs.com', 'photo.metuwang.com')
            return callback(url)
          }).catch(function (err) {
            notification.error({
              message: '上传失败！',
              description: err,
            })
          })
        }
      }

    },

    *del({payload, callback}, {call, put}) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      })
      const res = yield call(
        (params) => {
          return Request('/api/FileOssEdit', {method: 'POST', body: params,})
        },
        {}
      )
      if (res.status === 1) {
        let client = getClient(res.data)
        client.deleteMulti(payload.keys)
          .catch(function (err) {
            notification.error({
              message: '删除失败！',
              description: err,
            })
          })
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      })
    },

  },

  reducers: {
    changeLoading(state, {payload}) {
      return {
        ...state,
        loading: payload,
        uploadAvatar: '',
      }
    },
    changeSubmitting(state, {payload}) {
      return {
        ...state,
        submitting: payload,
      }
    },
  }

}
