/*
 * 评论列表
 * aid：文章id
 * theme：主题配色 black、white
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Moment from 'moment';
import { Icon, Input } from 'antd';
import { filterStr } from "@/utils/utils";
import styles from './CommentList.less';

import CommentForm from './CommentForm'

@connect(state => ({
  global: state.global,
}))
export default class CommentList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      commentId: '',                        //被回复的评论id
      reply_to: '',                         //被回复的用户id
      popoverVisible: [],							      //评论操作提示卡
      placeholder: '写下您的评论...',

      list: [],
      total: 0,
      hasMore: false,

    };
  }

  componentDidMount(){
    this.queryCommentList(this.props.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.id !== this.props.id){
      this.queryCommentList(nextProps.id);
    }
  }

  //查询评论列表
  queryCommentList = (id) => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/request',
      url: `/articles/${id}/comments`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        if(res.status === 1){
          this.setState({
            list: res.data.list,
            totla: res.data.total,
            hasMore: res.data.hasMore
          })
        }
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });
  };

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

  //举报评论
  reportComment(id){
    this.props.dispatch({
      type: 'comment/report',
      payload: {id: id},
      callback: (res) => {
        if(res.status === 1){

        }else{

        }
      }
    });
  }

  likeComment(topic, commentId){

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    if(!this.checkLogin()) return false;												      //检查登录状态

    let _id = topic._id,
      author = this.props.global.currentUser._id,
      action = topic.like.indexOf(author) < 0 ? 'add' : 'del';

    this.props.dispatch({
      type: 'comment/like',
      payload: {
        _id: _id,
        author: author,
        action: action,
        commentId: commentId ? commentId : ''
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });
  }

  //评论回复切换
  toggleReply(topic){
    if(topic.replyList.length === 0){
      this.queryReplyList(topic)
    }else{
      this.toggleReplyList(topic)
    }
  }

  toggleReplyList(topic){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'comment/replyToggle',
      payload: {
        _id: topic._id,           //被回复的评论_id
        isVisible: !topic.isVisible
      },
      callback: () => {
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });
  }

  queryReplyList(topic){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'comment/replyList',
      payload: {
        _id: topic._id,           //被回复的评论_id
        ids: topic.reply,
        currentPage: topic.currentPage
      },
      callback: () => {
        setTimeout(() => {this.ajaxFlag = true}, 500)
      }
    });
  }

  render(){

    const theme = this.props.theme ? styles[this.props.theme] : styles.white;
    const {list, total, hasMore} = this.state;
    const {isAuth, currentUser} = this.props.global;

    //生成评论列表
    const commnetList = total > 0 ?
      list.map((topic, index) => (
        <li key={index} className={styles.item}>
          <Link className={styles.avatar} to={`/users/${topic.author.username}`}>
            {
              topic.author.avatar ?
                <img src={topic.author.avatar + '?x-oss-process=style/thumb_s'} alt="avatar" />
                :
                <Icon type="user" />
            }
          </Link>
          <div className={styles.content}>

            <div className={styles.head}>
              <span className={styles.username}><Link to={`/users/${topic.author.username}`}>{topic.author.nickname}</Link></span>
            </div>

            <div className={styles.body}>
              <p>{topic.content}</p>
            </div>

            <div className={styles.foot}>
              <p className={styles.action}>
                <span className={styles.date}>{Moment(topic.createtime).format('YYYY-MM-DD HH:mm')}</span>
                {
                  topic.reply.length > 0 ?
                    <span className={styles.replyTotal}>
                      <a onClick={() => this.toggleReply(topic)}>
                        {
                          topic.isVisible ?
                            <em>收起回复<Icon type="up" /></em>
                            :
                            <em>{topic.reply.length}条回复<Icon type="down" /></em>
                        }
                      </a>
                    </span>
                    : null
                }
                {
                  currentUser._id === topic.author._id ? null :
                    <span className={styles.reply}><a onClick={() => this.replyComment(topic)}>回复</a></span>
                }
                {
                  currentUser._id === topic.author._id ? null :
                    <span className={styles.report}><a onClick={() => this.reportComment(topic._id)}><Icon type="exclamation-circle-o"/></a></span>
                }
                {
                  currentUser._id === topic.author._id ? null :
                    <span className={styles.like}>
                      <a onClick={() => this.likeComment(topic)}>
                        {topic.like.indexOf(currentUser._id) < 0 ? <Icon type="like-o"/> : <Icon type="like"/>}
                          <em className={styles.likeCount}>{topic.like ? topic.like.length : 0}</em>
                      </a>
                    </span>
                }
              </p>
            </div>
            {
              topic.isVisible ?
                <div className={styles.replyList}>
                  {
                    topic.replyList.map((item, i) => (
                      <div key={i} className={styles.item}>
                        <Link className={styles.avatar} to={`/users/${item.author.username}`}>
                          {
                            item.author.avatar ?
                              <img src={item.author.avatar + '?x-oss-process=style/thumb_s'} alt="avatar" />
                              :
                              <Icon type="user" />
                          }
                        </Link>

                        <div className={styles.content + ' ' +styles.replyContent}>
                          {/*<div className={styles.head}></div>*/}

                          <div className={styles.body}>
                            <p>
                              <span className={styles.username}><Link to={`/users/${item.author.username}`}>{item.author.nickname}</Link> </span>
                              { item.reply_to ? <span>回复 <Link to={`/users/${item.reply_to.username}`}>{item.reply_to.nickname}</Link> </span> : null }
                              <span>{item.content}</span>
                            </p>
                          </div>

                          <div className={styles.foot}>
                            <p className={styles.action}>
                              <span className={styles.date}>{Moment(topic.createtime).format('YYYY-MM-DD HH:mm')}</span>
                              {
                                currentUser._id === item.author._id ? null :
                                  <span className={styles.reply}>
                                      <a onClick={() => this.replyComment(topic, item)}>回复</a>
                                    </span>
                              }
                              {
                                currentUser._id === item.author._id ? null :
                                  <span className={styles.like}>
                                      <a onClick={() => this.likeComment(item, topic._id)}>
                                        {item.like.indexOf(currentUser._id) < 0 ? <Icon type="like-o"/> :
                                          <Icon type="like"/>}
                                        <em className={styles.likeCount}>{item.like ? item.like.length : 0}</em>
                                      </a>
                                    </span>
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  {
                    topic.hasMore ?
                    <a className={styles.moreComment} onClick={() => this.queryReplyList(topic)}>查看更多评论</a>
                    : null
                  }
                </div>
              : null
            }
          </div>
        </li>
      ))
      : null;

    return(

      <div className={styles.comment+ ' '+ theme}>

        <div className={styles.title}>
          {
            total > 0 ?
              <p><span>{total}</span> 条评论</p>
              :
              <p>暂无评论</p>
          }
        </div>

        <div className={styles.form}>
          <CommentForm/>
        </div>

        <div className={styles.list}>
          <ul>{commnetList}</ul>
          {
            hasMore ?
              <a className={styles.moreComment} onClick={this.queryCommentList}>查看更多评论</a>
              : null
          }
        </div>

      </div>

    )

  }

}
