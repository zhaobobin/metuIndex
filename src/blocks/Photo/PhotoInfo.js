/*
 * 图片信息 - PhotoSwiper.currentPhoto对应的图片信息
 * detail：文章数据
 * tags：标签
 * currentPhoto：当前图片
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './PhotoInfo.less';

import ArticleAuthorInfo from '@/blocks/Article/ArticleAuthorInfo'

@connect(state => ({
  global: state.global,
  oss: state.oss,
}))
export default class PhotoInfo extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      exifShow: '',
      followState: '',
    };
  }

  //检查登录状态
  checkLogin = () => {
    let {isAuth} = this.props.global;
    if(!isAuth){
      this.props.dispatch({
        type: 'global/changeSignModal',
        payload: {
          signModalVisible: true,
          signTabKey: '1',
        }
      });
      this.ajaxFlag = true;
      return false;
    }
    return true;
  };

  //关注
  handleFollow = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    if(!this.checkLogin()) return false;								//检查登录状态
  };

  //显示exif详情
  showExifDetail = () => {
    this.setState({exifShow: styles.show})
  };
  //隐藏exif详情
  closeExifDetail = () => {
    this.setState({exifShow: ''})
  };

  render(){

    const { detail, currentPhoto } = this.props;
    // console.log(currentPhoto)
    const currentPhotoExif = JSON.parse(currentPhoto.exif)

    //tags
    const tagsList = detail.tags ?
      detail.tags.map((topic, index) => (
        <Link className={styles.tagItem} key={index} to={`/tags/${topic}`}>{topic}</Link>
      ))
      : null;

    //图片元数据详情
    let exifArr = [];
    for(let i in currentPhotoExif){
      let o = {name: i, value: currentPhotoExif[i].value}
      exifArr.push(o)
    }
    const exifDetail = exifArr.length > 0 ?
      exifArr.map((topic, index) => (
        <p key={index}>
          <label>{topic.name}</label>
          <span>{topic.value}</span>
        </p>
      ))
      :
      '';

    return(
      <div className={styles.photoInfo}>

        {
          detail ?
            <div className={styles.frame}>

              <div className={styles.section+" "+styles.author}>
                <ArticleAuthorInfo detail={detail} />
              </div>

              <div className={styles.section+" "+styles.title}>
                <h1>{detail.title}</h1>
                <p>{currentPhoto.title}</p>
                <p className={styles.tagList}>{tagsList}</p>
              </div>

              {
                currentPhotoExif ?
                  <div className={styles.section+" "+styles.exif}>
                    <ul>
                      <li key="model" className={styles.camera}>
                        {
                          currentPhoto.camera ?
                            <Link to={`/equipments/camera-${currentPhoto.camera.modelName}`}>{currentPhoto.camera.model}</Link>
                            :
                            '无相机记录'
                        }

                      </li>
                      <li key="lens" className={styles.lens}>
                        {
                          currentPhoto.lens ?
                            <Link to={`/equipments/lens-${currentPhoto.lens.modelName}`}>{currentPhoto.lens.model}</Link>
                            :
                            '无镜头记录'
                        }
                      </li>
                      {
                        currentPhoto.exposure ?
                          <li key="fn">
                            {currentPhoto.exposure.FNumber ? <span>f{currentPhoto.exposure.FNumber},</span> : null}
                            {currentPhoto.exposure.ExposureTime ? <span>{currentPhoto.exposure.ExposureTime}s,</span> : null}
                            {currentPhoto.exposure.ISOSpeedRatings ? <span>ISO{currentPhoto.exposure.ISOSpeedRatings}</span> : null}
                          </li>
                          :
                          ''
                      }
                      <li><a onClick={this.showExifDetail}>查看完整exif信息</a></li>
                    </ul>
                  </div>
                  : null
              }
            </div>
            : null
        }

        <div className={styles.exifDetail + " " + this.state.exifShow}>
          <p>
            <label><strong>EXIF信息</strong></label>
            <span><a className={styles.close} onClick={this.closeExifDetail}>关闭</a></span>
          </p>
          {exifDetail}
        </div>

      </div>
    )

  }

}
