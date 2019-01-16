/*
 * 图片信息 - PhotoSwiper.currentPhoto对应的图片信息
 * detail：文章数据
 * tags：标签
 * currentPhoto：当前图片
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Row, Col, Icon, Spin, notification} from 'antd';
import Moment from 'moment';
import {ENV, Storage, goBack} from "../../utils/utils";

import styles from './PhotoInfo.less';

@connect(state => ({
  login: state.login,
  oss: state.oss,
}))
export default class PhotoInfo extends PureComponent {

  state = {
    exifShow: '',
  };

  //检查登录状态
  checkLogin = () => {
    let {isAuth} = this.props.login;
    if(!isAuth){
      this.props.dispatch({
        type: 'login/changeModal',
        payload: {
          modalVisible: true,
          tabKey: '1',
        }
      });
      Storage.set('metu-ajaxFlag', true);
      return false;
    }
    return true;
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

    const {detail, tags, currentPhoto} = this.props;

    //console.log(currentPhoto)

    //tags
    const tagsList = tags ?
      tags.map((topic, index) => (
        <Link className={styles.tagItem} key={index} to={`tags/${topic}`}>{topic}</Link>
      ))
      : null;

    //图片元数据详情
    let exifArr = [],
      exifDetail = '',
      exif = JSON.parse(currentPhoto.exif);
    if(currentPhoto.exif){
      for(let i in exif){
        let obj = {name: i, value: exif[i].value};
        exifArr.push(obj);
      }
      exifDetail = exifArr.map((topic, index) => (
        <p key={index}>
          <label>{topic.name}</label>
          <span>{topic.value}</span>
        </p>
      ));
    }

    return(
      <div className={styles.photoInfo}>

        {
          detail ?
            <div className={styles.frame}>
              <div className={styles.section+" "+styles.post}>
                <Link to={`/u/${detail.uid.username}`} className={styles.avatar}>
                  {
                    detail.uid.avatar ? <img src={detail.uid.avatar + '?x-oss-process=style/thumb_s'} /> : <Icon type="user" />
                  }
                </Link>
                <p>
                  <Link to={`/u/${detail.uid.username}`}>
                    <span>{detail.uid.nickname}</span>
                  </Link>
                </p>
                <p className={styles.date}>
                  <span>{Moment(detail.createtime).format('YYYY-MM-DD')}</span>
                  <span><Icon type="eye-o" /> {detail.views}</span>
                </p>
                <a className={styles.follow} onClick={this.handleFollow}>
                  {
                    this.state.followState ? <span>已关注</span> : <span>关注</span>
                  }
                </a>
              </div>
              <div className={styles.section+" "+styles.title}>
                <h1>{detail.title}</h1>
                <p>{currentPhoto.title}</p>
                <p className={styles.tagList}>{tagsList}</p>
              </div>
              {
                exif ?
                  <div className={styles.section+" "+styles.exif}>
                    <ul>
                      <li key="model" className={styles.camera}>
                        {
                          exif.Model ?
                            <Link to={`/equipments/camera-${currentPhoto.camera.name}`}>{exif.Model.value}</Link>
                            :
                            '无相机记录'
                        }

                      </li>
                      <li key="lens" className={styles.lens}>
                        {
                          exif.LensModel ?
                            <Link to={`//equipments/lens-${currentPhoto.lens.name}`}>{exif.LensModel.value}</Link>
                            :
                            '无镜头记录'
                        }
                      </li>
                      {
                        exif.FNumber ?
                          <li key="fn">
                            <span>f{exif.FNumber.value},</span>
                            <span>{exif.ExposureTime.value}s,</span>
                            <span>ISO{exif.ISOSpeedRatings.value}</span>
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

        <div className={styles.exifDetail+" "+this.state.exifShow}>
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
