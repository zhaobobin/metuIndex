/*
 * 图片详情
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Row, Col, Icon, Spin, notification} from 'antd';

import {ENV, Storage, goBack} from "~/utils/utils";

import styles from './PhotoDetail.less';

import PhotoSwiper from '~/components/Photo/PhotoSwiper';
import PhotoAction from '~/components/Photo/PhotoAction';
import PhotoInfo from '~/components/Photo/PhotoInfo';
import CommentList from '~/components/Comment/CommentList';


@connect(state => ({
  global: state.global,
}))
export default class AlbumDetail extends PureComponent {

  state = {
    id: this.props.match.params.id,                                           //文章id
    detail: '',
    currentPhoto: ''
  };

  componentDidMount(){
    let id = this.state.id;
    this.queryArticleDetail(id);
  }

  queryArticleDetail(id){
    this.props.dispatch({
      type: 'global/post',
      url: 'api/ArticleDetail',
      payload: {
        id: id
      },
      callback: (res) => {
        if(res.status === 1){
          let data = res.data;
          document.title = data.title + " - " + data.uid.nickname + " - " + ENV.appname;
          if(typeof(data.content) === 'string') data.content = JSON.parse(data.content);			//转换图片列表数据
          if(data.tags && typeof(data.tags) === 'string') data.tags = data.tags.split(',');

          this.setState({
            detail: data,
            currentPhoto: data.content[0]
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
              <PhotoSwiper list={detail.content} currentKey={0} callback={this.changeCurrentPhoto} />
              : null
          }
        </div>

        {
          currentPhoto ?
            <div className={styles.photoSlide}>

              <div className={styles.head}>
                <PhotoAction data={detail} />
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
