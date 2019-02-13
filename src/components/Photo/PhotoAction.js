/*
 * 图片操作
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Icon} from 'antd';
import styles from './PhotoAction.less';

import CusShare from '~/components/Article/CusShare'

@connect(state => ({
  global: state.global,
}))
export default class PhotoAction extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      detail: '',
      likeState: false,												                                  //喜欢该文章的状态
      likeCount: '',														                                //喜欢该文章的人数
      collectState: '',													                                //对应当前用户的收藏状态
      followState: '',													                                //对应当前用户的关注状态
    };
  }

  componentDidMount(){
    let data = this.props.data,
      {global} = this.props;
    this.initArticle(data, global)
  }

  //处理用户登录、退出时，重新渲染文章数据
  componentWillReceiveProps(nextProps){
    if(nextProps.global.isAuth !== this.props.global.isAuth){
      this.initArticle(this.state.detail, nextProps.global)
    }
  }

  initArticle(data, global){
    let {isAuth, currentUser} = global;
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

  //喜欢
  handleLike = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    if(!this.checkLogin()) return false;								//检查登录状态

    let {global} = this.props;
    let _id = this.state.detail._id,
      uid = this.props.global.currentUser._id,
      action = this.state.likeState ? 'del' : 'add';

    this.props.dispatch({
      type: 'global/post',
      url: 'api/ArticleLike',
      payload: {
        _id: _id,
        uid: uid,
        action: action,
      },
      callback: (res) => {
        this.initArticle(res.data, global);
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });

  };

  //收藏
  handleCollect = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    if(!this.checkLogin()) return false;								//检查登录状态

    let _id = this.state.detail._id,
      uid = this.props.global.currentUser._id,
      action = this.state.collectState ? 'del' : 'add';

    this.props.dispatch({
      type: 'global/post',
      url: 'api/UserCollect',
      payload: {
        _id: _id,
        uid: uid,
        action: action,
      },
      callback: (res) => {
        if(res.status === 1) this.setState({collectState: !this.state.collectState});
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });

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

    return(

      <div className={styles.handle}>
        {
          detail ?
            <ul>
              <li className={styles.li1}>
                <a title="喜欢" onClick={this.handleLike}>
                  <Icon type={likeState ? "heart" : "heart-o"} />
                  <span className={styles.count}>{likeCount}</span>
                </a>
              </li>
              <li className={styles.li2}>
                <Icon type="message" />
                <span className={styles.count}>{detail.comments.length}</span>
              </li>
              <li className={styles.li3}>
                <CusShare/>
              </li>
              <li className={styles.li4}>
                <Icon type="ellipsis" />
                <div className={styles.menu}>
                  <a title="收藏" onClick={this.handleCollect}>
                    <Icon type={collectState ? "star" : "star-o"} /> 收藏
                  </a>
                  <a>举报</a>
                </div>
              </li>
              {/*<li><a><Icon type="ellipsis" /></a></li>*/}
            </ul>
            : null
        }
      </div>

    )

  }

}
