/*
 * 图片详情
 */
import React from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import { ENV } from '@/utils';
import { goBack } from "@/utils/utils";
import styles from './PhotoDetail.less';

import PhotoSwiper from '@/blocks/Photo/PhotoSwiper';
import PhotoAction from '@/blocks/Photo/PhotoAction';
import PhotoInfo from '@/blocks/Photo/PhotoInfo';

@connect(state => ({
  global: state.global
}))
export default class PhotoDetail extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      list: '',									                                                //列表数据
      currentPhoto: '',												                                  //当前图片信息
      currentKey: '',                                                           //当前图片索引值
    };
  }

  componentDidMount(){
    let id = this.props.match.params.id;
    this.initPhoto(id);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id) {
      let id = nextProps.match.params.id;
      this.initPhoto(id);
    }
  }

  initPhoto(id){

    this.props.dispatch({
      type: 'global/request',
      url: `/photos/${id}`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        let list = res.data;
        if(res.code === 0){
          let key = 0, currentPhoto = '';
          for(let i in list){
            if(list[i]._id === id){
              key = parseInt(i, 10);
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
          notification.error({message: '提示', description: res.message});
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

    // console.log(currentPhoto)

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
