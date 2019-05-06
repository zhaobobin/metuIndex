/*
 * 图片详情
 */
import React from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import {ENV, goBack} from "~/utils/utils";

import styles from './PhotoDetail.less';

import PhotoSwiper from '~/components/Photo/PhotoSwiper';
import PhotoAction from '~/components/Photo/PhotoAction';
import PhotoInfo from '~/components/Photo/PhotoInfo';

@connect(state => ({
  photo: state.photo,
  login: state.login,
}))
export default class PhotoDetail extends React.Component {

  state = {
    id: this.props.match.params.id,
    list: '',									                                                //列表数据
    currentPhoto: '',												                                  //当前图片信息
    currentKey: '',                                                           //当前图片索引值
  };

  componentDidMount(){
    let id = this.state.id;
    this.initPhoto(id);
  }

  initPhoto(id){

    this.props.dispatch({
      type: 'photo/listByUser',
      payload: {
        id: id
      },
      callback: (res) => {
        let list = res.data;
        if(res.status === 1){
          let key = 0, currentPhoto = '';
          for(let i in list){
            if(list[i]._id === id){
              key = parseInt(i);
              currentPhoto = list[i];
            }
          }
          document.title = currentPhoto.title + " - 照片 - " + ENV.appname;
          this.setState({
            list: list,
            currentKey: key,
            currentPhoto: currentPhoto,
          });
        }else{
          notification.error({message: '提示', description: res.msg});
          goBack();
        }
      }
    });
  }

  changeCurrentPhoto = (photo) => {
    document.title = photo.title + " - 照片 - " + ENV.appname;
    this.setState({currentPhoto: photo});
  };

  render(){

    const { list, currentKey, currentPhoto } = this.state;

    //console.log(list)

    return(
      <div className={styles.photoDetail}>

        <div className={styles.photoContent}>
          {
            currentPhoto ?
              <PhotoSwiper list={list} currentKey={currentKey} callback={this.changeCurrentPhoto} />
              : null
          }
        </div>

        {
          currentPhoto ?
            <div className={styles.photoSlide}>

              <div className={styles.head}>
                <PhotoAction data={currentPhoto} />
              </div>

              <div className={styles.body}>
                <PhotoInfo detail={currentPhoto} tags={currentPhoto.tags} currentPhoto={currentPhoto}/>

              </div>

            </div>
            : null
        }

      </div>
    )
  }

}
