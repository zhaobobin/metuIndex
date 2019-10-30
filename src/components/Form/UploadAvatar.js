/**
 *	上传用户头像图片 - 接收父组件初始化url，返回上传后oss返回的url
 *	category: 图片分类 - logo、avatar、photo等，默认为photo
 *	url: 默认显示的图片
 *  callback: 父组件处理上传后的url
    handleSelectPhoto = (value) => {
      this.props.form.setFieldsValue({
        avatar: value
      });
    };
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Upload, Modal, notification } from 'antd';
import { Storage } from '@/utils';
import { file2base64 } from "@/utils/utils";
import styles from './UploadPhoro.less'

import PhotoCrop from '@/blocks/Photo/PhotoCrop';

@connect(state => ({
  login: state.login,
  oss: state.oss
}))
export default class UploadAvatar extends React.Component {

  state = {
    loading: false,
    url: this.props.url ? this.props.url : '',
    editVisible: false,
    file: '',                               //选取的图片文件
    base64: '',                             //裁剪用，待上传图片
  };

  componentDidMount(){
    Storage.set('metu-ajaxFlag', true);
  }

  componentWillUnmount(){
    this.handleCancel();
  }

  //上传限制，文件类型只能是jpg、png，文件大小不能超过2mb.
  beforeUpload = (file) => {

    let isImg = file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png';
    if (!isImg) notification.error({message: '只能上传jpg、png图片文件!'});

    let isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) notification.error({message: '图片文件的大小不能超过2MB!'});

    return isImg && isLt2M;

  };

  handleUpload = ({ file }) => {
    let _this = this;
    file2base64(file, function(data){
      _this.setState({
        editVisible: true,
        file: file,
        base64: data.base64
      });
    });
  };

  //上传OSS
  uploadOss = () => {
    if(!Storage.get('metu-ajaxFlag')) return;
    Storage.set('metu-ajaxFlag', false);

    let {file, base64} = this.state;
    //console.log(file)

    this.setState({ loading: true, url: '' });

    let option = {
      uid: this.props.login.currentUser._id,
      category: 'avatar',
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
        Storage.set('metu-ajaxFlag', true);
        //console.log(url);
        if(url){
          this.props.callback(url);                   //给父组件传值
          this.setState({ loading: false, url: url, editVisible: false, base64: '' });
        }else{
          notification.error({
            message: '上传错误！',
          });
          this.cancelBanner();
        }
      }
    });
  };

  //裁剪结果
  photoCropResult = (base64) => {
    this.setState({ base64: base64 });
  };

  handleOk = (e) => {
    this.uploadOss();
  };

  handleCancel = (e) => {
    this.setState({editVisible: false, base64: ''});
  };

  render(){

    const {loading, url, editVisible, base64} = this.state;

    return (

      <Row>
        <Col span={15}>
          <Upload
            accept=".jpg,.png"
            listType="picture-card"
            className={styles.thumb}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            customRequest={this.handleUpload}
          >
            {
              url ?
                <img src={url + '?x-oss-process=style/thumb_s'} width="85px" height="85px" alt="avatar" />
                :
                <div>
                  <Icon type={loading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">上传</div>
                </div>
            }
          </Upload>

          <Modal
            title="上传头像"
            width={650}
            maskClosable={false}
            destroyOnClose={true}
            visible={editVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <PhotoCrop src={base64}
              callback={this.photoCropResult}
              maxWidth={200}
              option={
                {
                  style: {
                  width: '100%',
                  height: '400px',
                  },
                  dragMode: "move",                             //裁剪方式
                  viewMode: 2,                                  //视图模式
                  autoCropArea: 1,                              //裁剪区域
                  aspectRatio: 16 / 16,                         //裁剪比例
                  guides: false,                                //裁剪框虚线
                  center: false,                                //显示裁剪框中心的加号
                  cropBoxResizable: true,                       //裁剪框能否缩放
                  toggleDragModeOnDblclick: false,              //能否切换裁剪方式
                  highlight: false,                             //裁剪框高亮
                  background: false,                            //显示画布背景
                }
              }
            />
          </Modal>
        </Col>
        <Col span={9}>
          <p className={styles.red}>只能上传jpg、png图片，文件大小不能超过2MB。</p>
        </Col>
      </Row>

    )

  }

}
