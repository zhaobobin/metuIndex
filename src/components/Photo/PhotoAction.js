/*
 * 图片操作
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Icon} from 'antd';
import {Storage} from "../../utils/utils";

import styles from './PhotoAction.less';

@connect(state => ({
  login: state.login,
}))
export default class PhotoAction extends PureComponent {

  state = {
    detail: '',
    likeState: false,												                                  //喜欢该文章的状态
    likeCount: '',														                                //喜欢该文章的人数
    collectState: '',													                                //对应当前用户的收藏状态
    followState: '',													                                //对应当前用户的关注状态
  };

  componentDidMount(){
    Storage.set('metu-ajaxFlag', true);
    let data = this.props.data,
      {login} = this.props;
    this.initArticle(data, login)
  }

  //处理用户登录、退出时，重新渲染文章数据
  componentWillReceiveProps(nextProps){
    if(nextProps.login.isAuth !== this.props.login.isAuth){
      this.initArticle(this.state.detail, nextProps.login)
    }
  }

  initArticle(data, login){
    let {isAuth, currentUser} = login;
    //判断当前用户的喜欢、收藏
    let likeState = isAuth ? data.like.indexOf(currentUser._id) > -1 : false,
      collectState = isAuth ? currentUser.collect.indexOf(data._id) > -1 : false,
      followState = isAuth ? currentUser.follow.indexOf(data.uid._id) > -1 : false;

    this.setState({
      detail: data,
      likeCount: data.like.length,
      likeState: likeState,
      collectState: collectState,
      followState: followState,
    });
  }

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

  //喜欢
  handleLike = () => {
    if(!Storage.get('metu-ajaxFlag')) return;
    Storage.set('metu-ajaxFlag', false);
    if(!this.checkLogin()) return false;								//检查登录状态

    let {login} = this.props;
    let _id = this.state.detail._id,
      uid = this.props.login.currentUser._id,
      action = this.state.likeState ? 'del' : 'add';

    this.props.dispatch({
      type: 'article/like',
      payload: {
        _id: _id,
        uid: uid,
        action: action,
      },
      callback: (res) => {
        this.initArticle(res.data, login);
        Storage.set('metu-ajaxFlag', true);
      }
    });

  };

  //收藏
  handleCollect = () => {
    if(!Storage.get('metu-ajaxFlag')) return;
    Storage.set('metu-ajaxFlag', false);
    if(!this.checkLogin()) return false;								//检查登录状态

    let _id = this.state.detail._id,
      uid = this.props.login.currentUser._id,
      action = this.state.collectState ? 'del' : 'add';

    this.props.dispatch({
      type: 'login/collect',
      payload: {
        _id: _id,
        uid: uid,
        action: action,
      },
      callback: (res) => {
        if(res.status === 1) this.setState({collectState: !this.state.collectState});
        Storage.set('metu-ajaxFlag', true);
      }
    });

  };

  //分享
  handleShare = () => {

  };

  //关注
  handleFollow = () => {

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

    const {detail, likeState, likeCount, collectState} = this.state;
//console.log(detail)
    return(

      <div className={styles.handle}>
        {
          detail ?
            <ul>
              <li>
                <Icon type="message" />
                <span>{detail.comments.length}</span>
              </li>
              <li>
                <a title="喜欢" onClick={this.handleLike}>
                  <Icon type={likeState ? "heart" : "heart-o"} />
                  <span>{likeCount}</span>
                </a>
              </li>
              <li>
              <a title="收藏" onClick={this.handleCollect}>
                <Icon type={collectState ? "star" : "star-o"} />
              </a>
              </li>
              <li><a title="分享" onClick={this.handleShare}><Icon type="share-alt" /></a></li>
              {/*<li><a><Icon type="ellipsis" /></a></li>*/}
            </ul>
            : null
        }
      </div>

    )

  }

}
