/*
 * 图片详情
 */
import React from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import { goBack } from "@/utils/utils";
import { ENV } from '@/utils';
import styles from './PhotoDetail.less';

import PhotoSwiper from '@/blocks/Photo/PhotoSwiper';
import PhotoAction from '@/blocks/Photo/PhotoAction';
import PhotoInfo from '@/blocks/Photo/PhotoInfo';

import CommentList from '@/containers/Comment/CommentList';

@connect(state => ({
  global: state.global,
}))
export default class PhotosDetail extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      detail: '',
      currentPhoto: ''
    };
  }

  componentDidMount(){
    let id = this.props.match.params.id;
    this.queryDetail(id);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id) {
      let id = nextProps.match.params.id;
      this.queryDetail(id);
    }
  }

  queryDetail(id){
    this.props.dispatch({
      type: 'global/request',
      url: `/photos/${id}`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        if(res.code === 0){
          let data = res.data;
          document.title = data.title + " - " + data.author.nickname + " - " + ENV.appname;
          if(data.tags && typeof(data.tags) === 'string') data.tags = data.tags.split(',');

          this.setState({
            detail: data,
            currentPhoto: data.images[0]
          });
        }else{
          notification.error({message: '提示', description: res.msg});
          goBack();
        }
      }
    });
  }

  changeCurrentPhoto = (photo) => {
    this.setState({currentPhoto: photo});
  };

  render(){

    const { id, detail, currentPhoto } = this.state;

    return(
      <div className={styles.photoDetail}>

        <div className={styles.photoContent}>
          {
            currentPhoto ?
              <PhotoSwiper list={detail.images} currentKey={0} callback={this.changeCurrentPhoto} />
              : null
          }
        </div>

        {
          currentPhoto ?
            <div className={styles.photoSlide}>

              <div className={styles.head}>
                <PhotoAction detail={detail} />
              </div>

              <div className={styles.body}>
                <PhotoInfo detail={detail} currentPhoto={currentPhoto}/>
                <div className={styles.foot}>
                  <CommentList id={id} theme="black"/>
                </div>
              </div>

            </div>
            : null
        }

      </div>
    )
  }

}
