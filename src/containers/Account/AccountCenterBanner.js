import React from 'react';
import { connect } from 'dva';
import { Icon, Upload, notification } from 'antd';
import { file2base64 } from '~/utils/utils';
import defauleBanner from '~/assets/banner.jpg';
import styles from './AccountCenterBanner.less';

import PhotoCrop from '~/blocks/Photo/PhotoCrop';

@connect(state => ({
  global: state.global,
  oss: state.oss,
}))

export default class AccountCenterBanner extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      detail: this.props.detail,
      editVisible: false,
      notification: '',
      file: '',                               //选取的图片文件
      base64: '',                             //裁剪用，待上传图片
    };
  }

  componentWillUnmount(){
    this.cancelBanner();
  }

  //上传限制，文件类型只能是jpg、png，文件大小不能超过2mb.
  beforeUpload = (file) => {

    let isImg = file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png';
    if (!isImg) notification.error({message: '只能上传jpg、png图片文件!'});

    let isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) notification.error({message: '图片文件的大小不能超过2MB!'});

    return isImg && isLt2M;

  };

  handleUpload = ({file}) => {
    let _this = this;
    file2base64(file, function(data){
      if(data.width < 1000 || data.height < 400){
        notification.error({message: '背景图片要求：宽度>=1000px，高度>=400px'});
      }else{
        _this.setState({
          editVisible: true,
          file: file,
          base64: data.base64
        });
      }
    });
  };

  uploadOss = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let {file, base64} = this.state;
    //console.log(file)

    this.setState({ notification: '上传中，请稍后...' });

    let option = {
      uid: this.props.global.currentUser._id,
      category: 'banner',
      name: file.name.split('.')[0],
      unix: new Date().getTime(),
      type: file.name.split('.')[1],
    };
    let key = option.uid + '/' + option.category + '_' + option.unix + '.' + option.type;

    this.props.dispatch({
      type: 'oss/uploadBase64',
      payload: {
        key: key,
        base64: base64
      },
      callback: (url) => {

        this.ajaxFlag = true;

        this.props.dispatch({
          type: 'global/post',
          url: 'api/UserBanner',
          payload: {
            _id: this.props.global.currentUser._id,
            banner: url
          },
          callback: (res) => {
            if(res.status === 1){
              this.setState({ detail: res.data, editVisible: false, notification: '' });
            }else{
              notification.error({
                message: '更新错误！',
                description: res.msg,
              });
              this.cancelBanner();
            }
          }
        });

      }
    });
  };

  //裁剪结果
  photoCropResult = (base64) => {
    this.setState({ base64: base64 });
  };

  //确定
  saveBanner = () => {
    this.uploadOss()
  };
  //取消
  cancelBanner = () => {
    this.setState({ editVisible: false, notification: '', base64: '' });
  };

  render(){

    const {detail, editVisible, notification, base64} = this.state;
    const {currentUser} = this.props.global;

    const bannerUrl = detail.banner ?
      'url(' + detail.banner + '?x-oss-process=style/cover)'
      :
      'url(' + defauleBanner + ')';

    const city = detail.city === '中国' ?
      detail.city
      :
      detail.city.split(' - ')[0];

    return(

      <div className={styles.userCenterBanner} style={{backgroundImage: bannerUrl}}>
        <div className={styles.detail}>
          <div className={styles.avatar}>
            {detail.avatar ? <img src={detail.avatar + '?x-oss-process=style/thumb_s'} /> : <Icon type="user" />}
          </div>
          <p className={styles.username}>{detail.username}</p>
          <p className={styles.info}>
            <span>{city}</span>
            <span>关注 {detail.follow.length}</span>
            <span>粉丝 {detail.fans.length}</span>
          </p>
        </div>

        {
          notification ?
            <p className={styles.notification}><span>{notification}</span></p>
            : null
        }

        {
          currentUser && currentUser._id === detail._id ?
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
                <PhotoCrop src={base64}
                  callback={this.photoCropResult}
                  maxWidth={1600}
                  option={
                    {
                      style: {
                        width: '100%',
                        height: '382px',
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
                    }
                  }
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
            : null
        }

      </div>

    )
  }

}
