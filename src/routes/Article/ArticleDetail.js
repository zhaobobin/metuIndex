/*
 * 文章详情
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Icon } from 'antd';
import Moment from 'moment';
import {ENV, Storage} from "~/utils/utils";

import styles from './ArticleDetail.less';

import CommentList from '~/components/Comment/CommentList';

@connect(state => ({
  global: state.global,
}))
export default class ArticleDetail extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      id: this.props.match.params.id,
      detail: '',													                                      //文章数据

      likeState: false,												                                  //喜欢该文章的状态
      likeCount: '',														                                //喜欢该文章的人数
      collectState: '',													                                //对应当前用户的收藏状态
      followState: '',													                                //对应当前用户的关注状态
    };
  }

  componentDidMount(){
    Storage.set('metu-ajaxFlag', true);
    let id = this.state.id;
    this.queryArticleDetail(id);
  }

  //处理用户登录、退出时，重新渲染文章数据
  componentWillReceiveProps(nextProps){
    if(nextProps.login.isAuth !== this.props.login.isAuth){
      this.initArticle(nextProps.article.detail, nextProps.login)
    }
  }

  queryArticleDetail(id){
    let {login} = this.props;
    this.props.dispatch({
      type: 'fetch/post',
      url: 'api/ArticleDetail',
      payload: {
        id: id
      },
      callback: (res) => {
        this.initArticle(res.data, login);
      }
    });
  }

  initArticle(data, login){
    let {isAuth, currentUser} = login;

    document.title = data.title + " - " + ENV.appname;
    data.createtime = Moment(data.createtime).format('YYYY-MM-DD HH:mm');
    if(data.tags && typeof(data.tags) === 'string') data.tags = data.tags.split(',');

    //判断当前用户的喜欢、收藏
    let likeState = false,
      collectState = false,
      followState = false;
    if(isAuth){
      likeState = data.like.indexOf(currentUser._id) > -1;
      collectState = currentUser.collect.indexOf(data._id) > -1;
      followState = currentUser.follow.indexOf(data.uid._id) > -1;
    }

    this.setState({
      detail: data,
      likeState: likeState,
      collectState: collectState,
      followState: followState,
      likeCount: data.like.length
    });
    Storage.set('metu-ajaxFlag', true);
  }

  //绑定文章内容
  createMarkup(){
    return {__html: this.state.detail.content};
  };

  //检查登录状态
  checkLogin = () => {
    let {isAuth} = this.props.login;
    if(!isAuth){
      this.props.dispatch({
        type: 'global/changeSignModal',
        payload: {
          signModalVisible: true,
          signTabKey: '1',
        }
      });
      Storage.set('metu-ajaxFlag', true);
      return false;
    }
    return true;
  };

  //喜欢
  handleLike = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
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
        this.ajaxFlag = true;
      }
    });

  };

  //收藏
  handleCollect = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    if(!this.checkLogin()) return false;								//检查登录状态

    let _id = this.state.detail._id,
      uid = this.props.login.currentUser._id,
      action = this.state.collectState ? 'del' : 'add';

    this.props.dispatch({
      type: 'global/collect',
      payload: {
        _id: _id,
        uid: uid,
        action: action,
      },
      callback: (res) => {
        if(res.status === 1) this.setState({collectState: !this.state.collectState});
        this.ajaxFlag = true;
      }
    });

  };

  //分享
  handleShare = () => {

  };

  render(){

    const { detail } = this.state;

    const content = detail ?
      <div className={styles.content} dangerouslySetInnerHTML={this.createMarkup()} />
      : null;

    return(

      <Row>
        <Col xs={0} sm={0} md={3} lg={5} />
        <Col xs={24} sm={24} md={18} lg={14}>
          {
            detail ?
              <div className={styles.detail}>

                <div className={styles.head}>
                  <h1>{detail.title}</h1>
                  <ul className={styles.info}>
                    <li><Icon type="user" /> <span>{detail.uid.nickname}</span></li>
                    <li><Icon type="clock-circle-o" /> <span>{detail.createtime}</span></li>
                    <li><Icon type="eye-o" /><span>{detail.views}</span></li>
                    <li><Icon type="message" /><span>{detail.comments.length}</span></li>
                    <li>
                      <a title="喜欢" onClick={this.handleLike}>
                        {
                          this.state.likeState ?
                            <Icon type="heart" />
                            :
                            <Icon type="heart-o" />
                        }
                      </a>
                      <span className={styles.likeCount}>{this.state.likeCount}</span>
                    </li>
                    {/*<li>*/}
                    {/*<a title="收藏" onClick={this.handleCollect}>*/}
                    {/*{*/}
                    {/*this.state.collectState ?*/}
                    {/*<Icon type="star" />*/}
                    {/*:*/}
                    {/*<Icon type="star-o" />*/}
                    {/*}*/}
                    {/*</a>*/}
                    {/*</li>*/}
                    <li className="share">
                      {/*<p className="bdsharebuttonbox" data-tag="share_1">*/}
                      {/*<a className="bds_more" data-cmd="more"></a>*/}
                      {/*</p>*/}
                    </li>
                  </ul>
                </div>

                <div className={styles.body}>
                  <div className={styles.desc}>
                    <strong>摘要：</strong>
                    <span>{detail.description}</span>
                  </div>
                  {content}
                </div>

                <div className={styles.foot}>
                  {detail.allow_comment ? <CommentList id={this.state.id} /> : null}
                </div>

              </div>
              : null
          }
        </Col>
        <Col xs={0} sm={0} md={3} lg={5} />
      </Row>

    )

  }

}
