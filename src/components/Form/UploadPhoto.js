/**
 *	上传单张图片 - 接收父组件初始化url，返回上传后oss返回的url
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
import { Row, Col, Icon, Upload, notification } from 'antd';
import { Storage } from '@/utils';
import styles from './UploadPhoro.less'

@connect(state => ({
  global: state.global,
  oss: state.oss
}))
export default class UploadPhoto extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      url: this.props.url ? this.props.url : '',
      category: this.props.category ? this.props.category : 'photo',
    };
  }

  componentDidMount(){
    Storage.set('metu-ajaxFlag', true);
  }

  //上传限制，文件类型只能是jpg、png，文件大小不能超过2mb.
  beforeUpload = (file) => {

    let isImg = file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png';
    if (!isImg) notification.error({message: '只能上传jpg、png图片文件!'});

    let isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) notification.error({message: '图片文件的大小不能超过2MB!'});

    return isImg && isLt2M;

  };

  //上传OSS
  handleUpload = ({ file }) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.setState({ loading: true, url: '' });

    let option = {
      uid: this.props.global.currentUser._id,
      category: this.state.category,
      name: file.name.split('.')[0],
      unix: new Date().getTime(),
      type: file.name.split('.')[1],
    };
    let key = option.uid + '/' + option.category + '_' + option.unix + '.' + option.type;

    this.props.dispatch({
      type: 'oss/upload',
      payload: {
        key: key,
        file: file
      },
      callback: (url) => {
        this.props.callback(url);                   //给父组件传值
        this.setState({ loading: true, url: url });
        this.ajaxFlag = true;
      }
    });

  };

  render(){

    const {loading, url, category} = this.state;

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
                <img src={url + '?x-oss-process=style/thumb_s'} width="85px" height="85px" alt={category} />
                :
                <div>
                  <Icon type={loading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">上传</div>
                </div>
            }
          </Upload>
        </Col>
        <Col span={9}>
          <p className={styles.red}>只能上传jpg、png图片，文件大小不能超过2MB。</p>
        </Col>
      </Row>


    )

  }

}
