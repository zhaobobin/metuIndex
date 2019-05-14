import React from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Upload, Modal } from 'antd';
import {Storage, hasErrors, file2base64} from '~/utils/utils';
import styles from './PublishPhotoContent.less';

import { Alert } from '~/components/Dialog/Dialog'

@connect(state => ({
  global: state.global,
  oss: state.oss,
  publish: state.publish,
}))
export default class PublishPhotoContent extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      role: this.props.global.currentUser.role,
      uid: this.props.global.currentUser._id,
      modalVisible: false,
      photoList: [],                                        //暂存图片列表
      ossList: [],                                          //oss图片文件待删除列表
      current: 0,
    }
  }

  componentDidMount(){

  }

  //导入相册
  importAlbum = () => {

  };

  //查询用户相册列表
  queryAlbumList = () => {
    let uid = this.props.global.currentUser._id;
  };

  //图片上传前检查
  beforeUpload = (file) => {
    const isImg = file.type.split('/')[1] === 'jpeg' || file.type.split('/')[1] === 'png';
    if (!isImg) {
      Alert({
        title: '只能上传jpg、png图片文件!',
        callback: () => {}
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Alert({
        title: '图片文件的大小不能超过2MB!',
        callback: () => {}
      });
    }
    return isImg && isLt2M;
  };

  //上传图片列表
  handleUploadPhoto = ({file}) => {

    let photoList = this.state.photoList;
    if(photoList.length > 0){
      for(let i in photoList){
        //上传时排除文件名雷同的文件
        if(photoList[i].name === file.name) {
          Alert({
            title: '已存在雷同的图片!',
            callback: () => {}
          });
          return false;
        }
      }
    }

    file2base64(file, (base64) => {
      let imgData = {
        loading: true,                                          //加载状态
        key: '',                                                //对应oss中的键值
        category: '',
        name: file.name,                                        //完整文件名
        title: file.name.replace(/(.*\/)*([^.]+).*/ig,"$2"),    //文件标题
        tags: '',
        description: '',
        copyright: '',
        base64: base64,                                         //用于显示上传时的缩略图
        url: '',                                                //图片路径，用于显示
        adminid: this.state.uid,
        current: false,
      };
      photoList.push(imgData);
      this.setState({ photoList });
    });

    let option = {
      uid: this.props.global.currentUser._id,
      category: 'photo',
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
        let name = file.name,
          current = this.state.current,
          photoList = this.state.photoList,
          ossList = this.addOssList(key);                      //添加ossList列表
        for(let i in photoList){
          if(photoList[i].name === name){
            photoList[i].key = key;
            photoList[i].loading = false;
            photoList[i].url = url;
          }
          photoList[i].current = false;
        }
        if(photoList.length > 0) {
          current = photoList.length - 1;
          photoList[current].current = true;
        }
        this.setState({
          ossList,
          photoList,
          current
        });
      }
    });

  };

  changeCurrent = (index) => {
    let photoList = this.state.photoList;
    for(let i in photoList){
      let c = parseInt(i);
      photoList[i].current = c === index;
    }
    this.setState({
      photoList: photoList,
      current: index
    })
  };

  //保存图片
  savePhoto(data){
    //保存时，执行ossDel列表对应文件的删除操作
    this.props.dispatch({
      type: 'photo/add',
      payload: data,
      callback: (res) => {
        if(res.status === 1){
          this.queryList();
          this.delOssList();
          this.setState({
            visible: false,
            photoList: [],
          });
        }else{
          Alert({
            title: res.msg,
            callback: () => {}
          });
        }
      }
    });
  }

  //删除图片 - 仅删除暂存图片列表
  delPhoto(index){
    let photoList = this.state.photoList,
      key = photoList[index].key,
      ossList = this.updateOssList(key);
    photoList.splice(index, 1);
    this.setState({
      ossList,
      photoList,
    })
  }

  render(){

    const { oss } = this.props;
    const { photoList, current } = this.state;

    return(
      <div className={styles.container}>

        <Button size="large" onClick={this.importAlbum}>从相册导入</Button>

        <div className={styles.content}>

          <Row gutter={10}>

            {
              photoList.map((topic, index) => (
                <Col span={6} key={index} className={styles.item} onClick={this.changeCurrent.bind(this, index)}>
                  <div className={styles.imgBox}>
                    <p className={styles.url}>
                      <img
                        src={topic.base64 ? topic.base64.url : topic.url + '?x-oss-process=style/thumb_m'}
                        alt={topic.title}
                      />
                      {
                        topic.loading ?
                          <span className={styles.loading}><Icon type='loading' /></span>
                          : ''
                      }
                    </p>
                    {topic.current ? <p className={styles.border}/> : null}
                    <p className={styles.action}>
                      <span className={styles.del} onClick={this.delPhoto.bind(this, index)}>
                        <Icon type="close" />
                      </span>
                    </p>
                  </div>
                </Col>
              ))
            }

            {
              photoList.length <= 30 ?
                <Col xs={12} sm={12} md={6} lg={6}>
                  <Upload
                    name="photo"
                    accept=".jpg,.png"
                    listType="picture-card"
                    className={styles.upload}
                    multiple={true}
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                    customRequest={this.handleUploadPhoto}
                  >
                    <Icon type="plus" />
                    <p>最多可上传30张图片 <br/> 文件大小不超过2MB</p>
                  </Upload>
                </Col>
                :
                null
            }

          </Row>

        </div>
      </div>
    )
  }

}
