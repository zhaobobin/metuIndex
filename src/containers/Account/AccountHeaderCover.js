/**
 * 账户 - 封面图
 */
import React from 'react'
import {connect} from 'dva'
import { Upload, notification } from 'antd'
import { file2base64, createRandomId } from '@/utils/utils'
import styles from './AccountHeaderCover.less'

import defauleBanner from '@/assets/banner.jpg'
import PhotoCrop from '@/blocks/Photo/PhotoCrop'

@connect(state => ({
  global: state.global,
  oss: state.oss,
}))
export default class AccountHeaderCover extends React.Component {

  constructor(props) {
    super(props)
    this.ajaxFlag = true;
    this.state = {
      editVisible: false,
      uploadMessage: '',
      file: '',                               //选取的图片文件
      base64: '',                             //裁剪用，待上传图片
      scrollY: 0,
    }
  }

  componentDidMount() {
    window.scrollTo(0, document.body.clientWidth * 0.25);
    window.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    this.cancelBanner();
    window.removeEventListener('scroll', this.handleScroll, false);
  }

  //监控滚动
  handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    this.setState({
      scrollY
    })
  }

  //上传限制，文件类型只能是jpg、png，文件大小不能超过2mb.
  beforeUpload = (file) => {

    let isImg = file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png'
    if (!isImg) notification.error({message: '只能上传jpg、png图片文件!'})

    let isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) notification.error({message: '图片文件的大小不能超过2MB!'})

    return isImg && isLt2M

  }

  handleUpload = ({file}) => {
    let _this = this
    file2base64(file, function (data) {
      // console.log(data)
      if (data.width < 1000 || data.height < 400) {
        notification.error({message: '背景图片要求：宽度>=1000px，高度>=400px'})
      } else {
        _this.setState({
          editVisible: true,
          file: file,
          base64: data.url
        })
      }
    })
  }

  uploadOss = () => {
    if (!this.ajaxFlag) return
    this.ajaxFlag = false

    let {file, base64} = this.state;
    const uid = this.props.global.profileUser._id;
    //console.log(file)

    this.setState({uploadMessage: '上传中，请稍后...'})

    let option = {
      uid,
      category: 'banner',
      name: file.name.split('.')[0],
      id: createRandomId(),
      type: file.name.split('.')[1],
    }
    let key = option.uid + '/' + option.category + '_' + option.id + '.' + option.type

    this.props.dispatch({
      type: 'oss/uploadBase64',
      payload: {
        key: key,
        base64: base64
      },
      callback: (url) => {
        // console.log(url)
        this.ajaxFlag = true

        this.props.dispatch({
          type: 'global/request',
          url: '/api/UserBanner',
          method: 'POST',
          payload: {
            _id: uid,
            banner: url
          },
          callback: (res) => {
            if (res.code === 0) {
              this.setState({detail: res.data, editVisible: false, uploadMessage: ''})
            } else {
              notification.error({
                message: '更新错误！',
                description: res.message,
              })
              this.cancelBanner()
            }
          }
        })

      }
    })
  }

  //裁剪结果
  photoCropResult = (base64) => {
    this.setState({base64: base64})
  }

  //确定
  saveBanner = () => {
    this.uploadOss()
  }
  //取消
  cancelBanner = () => {
    this.setState({editVisible: false, uploadMessage: '', base64: ''})
  }

  render() {

    const { editVisible, uploadMessage, base64, scrollY } = this.state
    const { profileUser, currentUser } = this.props.global

    const bannerUrl = profileUser.cover_url ?
      'url(' + profileUser.cover_url + '?x-oss-process=style/cover)'
      :
      'url(' + defauleBanner + ')'

    return (
      <div
        ref="cover"
        className={styles.container}
        style={{
          backgroundImage: bannerUrl,
          transform: `translate3d(0px, ${scrollY / 2}px, 0px)`
        }}
      >

        {
          uploadMessage ?
            <p className={styles.uploadMessage}><span>{uploadMessage}</span></p>
            : null
        }

        {
          currentUser && currentUser._id === profileUser._id ?
            <Upload
              accept=".jpg,.png"
              className={styles.upload}
              showUploadList={false}
              beforeUpload={this.beforeUpload}
              customRequest={this.handleUpload}
            >
              <span>编辑封面 ></span>
            </Upload>
            :
            null
        }

        {
          editVisible ?
            <div className={styles.editBanner}>
              <div className={styles.banner}>
                {/*<img src={base64} ref="uploadBanner"/>*/}
                <PhotoCrop
                  src={base64}
                  callback={this.photoCropResult}
                  maxWidth={1600}
                  option={{
                    style: {
                      width: '100%',
                      height: '700px',
                    },
                    dragMode: "move",                             //裁剪方式
                    viewMode: 3,                                  //视图模式
                    autoCropArea: 1,                              //裁剪区域
                    aspectRatio: 16 / 4,                          //裁剪比例
                    guides: false,                                //裁剪框虚线
                    center: false,                                //显示裁剪框中心的加号
                    cropBoxResizable: false,                      //裁剪框能否缩放
                    toggleDragModeOnDblclick: false,              //能否切换裁剪方式
                    highlight: false,                             //裁剪框高亮
                    background: false,                            //显示画布背景
                  }}
                />
              </div>
              <div className={styles.action}>
                <span>拖拽图片，以调整图片位置</span>
                <p>
                  <a className={styles.submit} onClick={this.saveBanner}>保存</a>
                  <a className={styles.cancel} onClick={this.cancelBanner}>取消</a>
                </p>
              </div>
            </div>
            :
            null
        }

      </div>
    )
  }
}
