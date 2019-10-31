import React from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Button, Upload, Modal } from 'antd';
import { file2base64, createRandomId } from '@/utils/utils';
import styles from './PublishPhotoContent.less';

import { Alert } from '@/components/Dialog/Dialog'

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
      uid: this.props.global.currentUser._id,
      modalVisible: false,
      photoList: this.props.photoList || [],               //保存图片列表
      currentPhotoIndex: 0,                                //默认选择的图片索引值
    }
  }

  componentDidMount(){

  }

  // 从用户相册导入图片
  importAlbum = () => {
    let {uid} = this.state;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/photoList',
      payload: {
        uid
      },
      callback: (res) => {

      }
    })
  };

  //查询用户相册列表
  queryAlbumList = (uid) => {

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

  //上传图片到oss
  handleUploadPhoto = ({file}) => {
    // console.log(file)
    let {uid, photoList} = this.state;

    for(let i in photoList){
      if(photoList[i].name === file.name) {         //阻止上传与列表图片雷同的文件
        Alert({
          title: '已存在雷同的图片!',
          callback: () => {}
        });
        return false;
      }
    }

    let option = {
      category: 'photo',
      name: file.name.split('.')[0],
      //unix: new Date().getTime(),
      id: createRandomId(),
      type: file.name.split('.')[1],
    };
    let key = uid + '/' + option.id + '.' + option.type;

    // 根据key查询图片是否已上传

    file2base64(file, (base64) => {
      let imgData = {
        loading: true,                                            //加载状态
        cover: false,                                             //是否作为封面
        key,                                                      //对应oss中的键值
        name: option.name,                                        //完整文件名
        title: file.name.replace(/(.*\/)*([^.]+).*/ig,"$2"),      //文件标题
        description: '',                                          //描述
        base64: base64,                                           //用于显示上传时的缩略图
        width: base64.width,                                      //图片宽度
        height: base64.height,                                    //图片高度
        exif: '',                                                 //图片源数据
        camera: '',                                               //相机型号
        lens: '',                                                 //镜头型号
        url: '',                                                  //oss图片路径，用于显示
      };
      photoList.push(imgData);
      this.setState({ photoList });
    });

    this.props.dispatch({
      type: 'oss/upload',
      payload: {
        key: key,
        file: file
      },
      callback: (url) => {
        // console.log(url)

        // 查询exif
        this.props.dispatch({
          type: 'oss/exif',
          payload: {
            url
          },
          callback: (exif) => {
            console.log(exif)
            for(let i in photoList){
              if(photoList[i].name === option.name){
                photoList[i].loading = false;
                photoList[i].url = url;
                photoList[i].exif = exif ? JSON.stringify(exif) : '';
                if(exif){
                  //相机
                  photoList[i].camera = exif.Model ? {
                    brand: exif.Model.value.split(' ')[0],
                    brandName: exif.Model.value.split(' ')[0].toLowerCase(),
                    model: exif.Model.value,
                    modelName: exif.Model.value.replace(/\s+/g, "-").toLowerCase()
                  } : '';
                  //镜头
                  photoList[i].lens = exif.LensModel ? {
                    brand: exif.LensModel.value.split(' ')[0],
                    brandName: exif.LensModel.value.split(' ')[0].toLowerCase(),
                    model: exif.LensModel.value,
                    modelName: exif.LensModel.value.replace(/\s+/g, "-").toLowerCase()
                  } : '';
                  //曝光
                  photoList[i].exposure = {
                    FNumber: exif.FNumber ? exif.FNumber.value.split('/')[0] : '', // 光圈
                    ExposureTime: exif.ExposureTime ? exif.ExposureTime.value : '', // 速度
                    ISOSpeedRatings: exif.ISOSpeedRatings ? exif.ISOSpeedRatings.value : '' // iso
                  }
                }
              }
            }
            if(photoList.length > 0) {
              photoList[0].cover = true;
            }

            this.setState({
              photoList,
            });

            this.props.dispatch({
              type: 'publish/savePhotoContent',
              payload: {
                images: photoList,
                thumb: {
                  url: photoList[0].url,
                  width: photoList[0].width,
                  height: photoList[0].height,
                }
              }
            });
            // console.log(photoList)

          }
        });


      }
    });

  };

  //删除图片 - 仅删除暂存图片列表
  delPhoto = (index) => {
    let photoList = this.state.photoList;
    photoList[index].del = true;
    this.setState({
      photoList,
    })
  }

  // 切换当前图片
  changeCover = (index) => {
    let photoList = this.state.photoList;
    for(let i in photoList){
      let c = parseInt(i, 10);
      photoList[i].cover = c === index;
    }
    this.setState({
      photoList: photoList
    })
  };

  render(){

    const { photoList } = this.state;

    return(
      <div className={styles.container}>

        <Button size="large" onClick={this.importAlbum}>从相册导入</Button>

        <div className={styles.content}>

          <Row gutter={10}>

            {
              photoList.map((item, index) => (
                item.del ?
                  null
                  :
                  <Col
                    span={6}
                    key={index}
                    className={styles.item}
                    onClick={() => this.changeCover(index)}
                  >
                    <div className={styles.imgBox}>
                      <p className={styles.url}>
                        <img
                          src={item.base64 ? item.base64.url : item.url + '?x-oss-process=style/thumb_m'}
                          alt={item.title}
                        />
                        {
                          item.loading ?
                            <span className={styles.loading}><Icon type='loading' /></span>
                            : ''
                        }
                      </p>
                      {item.cover ? <p className={styles.border}/> : null}
                      <p className={styles.action}>
                        <span className={styles.del} onClick={ () =>this.delPhoto(index) }>
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

        <Modal/>

      </div>
    )
  }

}
