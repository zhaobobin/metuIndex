/*
 * 评论列表
 * aid：文章id
 * theme：主题配色 black、white
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Form, Icon, Input, Popover, notification } from 'antd';
import Moment from 'moment';
import {ENV, Storage, filterStr} from "../../utils/utils";

import styles from './CommentList.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(state => ({
  comment: state.comment,
  login: state.login,
}))
@Form.create()
export default class CommentList extends PureComponent {

  state = {
    aid: this.props.id,                   //文章id
    commentId: '',                        //被回复的评论id
    replyUid: '',                         //被回复的用户id
    popoverVisible: [],							      //评论操作提示卡
    placeholder: '写下您的评论...',
  };

  componentDidMount(){
    Storage.set('metu-commentFlag', true);
    this.queryCommentList(this.state.aid);
  }

  //组件卸载时清空评论列表
  componentWillUnmount(){
    this.props.dispatch({
      type: 'comment/clearList'
    });
  }

  queryCommentList = () => {
    if(!Storage.get('metu-commentFlag')) return;
    Storage.set('metu-commentFlag', false);

    this.props.dispatch({
      type: 'comment/list',
      payload: {
        aid: this.state.aid,
        currentPage: this.props.comment.currentPage,
        params: {}
      },
      callback: (res) => {
        Storage.set('metu-commentFlag', true);
      }
    });
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
      Storage.set('metu-commentFlag', true);
      return false;
    }
    return true;
  };

  //确定发表评论
  commentSubmit = (e) => {
    e.preventDefault();
    if(!Storage.get('metu-commentFlag')) return;
    Storage.set('metu-commentFlag', false);

    if(!this.checkLogin()) return false;												      //检查登录状态
    let data = {
      aid: this.state.aid,
      uid: this.props.login.currentUser._id
    };
    if(this.state.commentId) data.commentId = this.state.commentId;			    //被回复的评论id
    if(this.state.replyUid) data.replyUid = this.state.replyUid;			      //被回复的用户id
    this.props.form.validateFields(['remark'], (err, values) => {
      if(!err){
        let content = filterStr(values.remark);
        if(content.trim() === ''){															        //评论不能为空
          this.props.form.resetFields();
          Storage.set('metu-commentFlag', true);
          return;
        }
        data.content = content;
        this.addComment(data)
      }
    });
  };

  //增加评论
  addComment = (data) => {
    this.props.dispatch({
      type: 'comment/add',
      payload: data,
      callback: (res) => {
        if(res.status === 1){
          this.props.form.resetFields();
        }else{
          notification.error({
            message: '提交失败！',
            description: res.msg,
          });
        }
        Storage.set('metu-commentFlag', true);
      }
    });
  };

  //回复评论
  replyComment(topic, item){

    let nickname = item ? item.uid.nickname : topic.uid.nickname,
      placeholder = '回复：' + nickname;

    this.inputRef.focus();
    this.setState({
      commentId: topic._id,
      replyUid: item ? item.uid._id : '',
      placeholder: placeholder
    })
  }

  focusHandle = () => {
    Storage.set('metu-commentFlag', false);
  };

  blurHandle = () => {
    Storage.set('metu-commentFlag', true);
  };

  resetComment = (e) => {
    this.props.form.resetFields();
    this.setState({commentId: '', replyUid: '', placeholder: '写下您的评论...'});
  };

  //举报评论
  reportComment(id){
    this.props.dispatch({
      type: 'comment/report',
      payload: {id: id},
      callback: (res) => {
        if(res.status === 1){
          notification.success({
            message: res.msg,
          });
        }else{
          notification.error({
            message: '举报失败！',
            description: res.msg,
          });
        }
      }
    });
  }

  likeComment(topic, commentId){

    if(!Storage.get('metu-commentFlag')) return;
    Storage.set('metu-commentFlag', false);
    if(!this.checkLogin()) return false;												      //检查登录状态

    let _id = topic._id,
      uid = this.props.login.currentUser._id,
      action = topic.like.indexOf(uid) < 0 ? 'add' : 'del';

    this.props.dispatch({
      type: 'comment/like',
      payload: {
        _id: _id,
        uid: uid,
        action: action,
        commentId: commentId ? commentId : ''
      },
      callback: (res) => {
        Storage.set('metu-commentFlag', true);
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
    if(!Storage.get('metu-commentFlag')) return;
    Storage.set('metu-commentFlag', false);

    this.props.dispatch({
      type: 'comment/replyToggle',
      payload: {
        _id: topic._id,           //被回复的评论_id
        isVisible: !topic.isVisible
      },
      callback: () => {
        Storage.set('metu-commentFlag', true);
      }
    });
  }

  queryReplyList(topic){
    if(!Storage.get('metu-commentFlag')) return;
    Storage.set('metu-commentFlag', false);

    this.props.dispatch({
      type: 'comment/replyList',
      payload: {
        _id: topic._id,           //被回复的评论_id
        ids: topic.reply,
        currentPage: topic.currentPage
      },
      callback: () => {
        Storage.set('metu-commentFlag', true);
      }
    });
  }

  render(){

    const theme = this.props.theme ? styles[this.props.theme] : styles.white;
    const {getFieldDecorator} = this.props.form;
    const {list, total, hasMore} = this.props.comment;
    const {isAuth, currentUser} = this.props.login;

    //生成评论列表
    const commnetList = total > 0 ?
      list.map((topic, index) => (
        <li key={index} className={styles.item}>
          <Link className={styles.avatar} to={`/u/${topic.uid.username}`}>
            {topic.uid.avatar ? <img src={topic.uid.avatar + '?x-oss-process=style/thumb_s'} /> : <Icon type="user" />}
          </Link>
          <div className={styles.content}>

            <div className={styles.head}>
              <span className={styles.username}><Link to={`/u/${topic.uid.username}`}>{topic.uid.nickname}</Link></span>
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
                  currentUser._id === topic.uid._id ? null :
                    <span className={styles.reply}><a onClick={() => this.replyComment(topic)}>回复</a></span>
                }
                {
                  currentUser._id === topic.uid._id ? null :
                    <span className={styles.report}><a onClick={() => this.reportComment(topic._id)}><Icon type="exclamation-circle-o"/></a></span>
                }
                {
                  currentUser._id === topic.uid._id ? null :
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
                        <Link className={styles.avatar} to={`/u/${item.uid.username}`}>
                          {item.uid.avatar ? <img src={item.uid.avatar + '?x-oss-process=style/thumb_s'} /> : <Icon type="user" />}
                        </Link>

                        <div className={styles.content + ' ' +styles.replyContent}>
                          {/*<div className={styles.head}></div>*/}

                          <div className={styles.body}>
                            <p>
                              <span className={styles.username}><Link to={`/u/${item.uid.username}`}>{item.uid.nickname}</Link> </span>
                              { item.replyUid ? <span>回复 <Link to={`/u/${item.replyUid.username}`}>{item.replyUid.nickname}</Link> </span> : null }
                              <span>{item.content}</span>
                            </p>
                          </div>

                          <div className={styles.foot}>
                            <p className={styles.action}>
                              <span className={styles.date}>{Moment(topic.createtime).format('YYYY-MM-DD HH:mm')}</span>
                              {
                                currentUser._id === item.uid._id ? null :
                                  <span className={styles.reply}>
                                      <a onClick={() => this.replyComment(topic, item)}>回复</a>
                                    </span>
                              }
                              {
                                currentUser._id === item.uid._id ? null :
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
          <Form onSubmit ={this.commentSubmit}>
            <FormItem ref="textarea">
              {getFieldDecorator('remark', {
                rules: [
                  { required: true, message: '请输入评论内容！' },
                  { max: 100, message: '不能超过100字！'}
                ],
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }}
                  placeholder={this.state.placeholder}
                  ref={c => this.inputRef = c}
                  onFocus={this.focusHandle}
                  onBlur={this.blurHandle}
                  onClick={this.checkLogin}
                />
              )}
            </FormItem>
            <div className={styles.action}>
              <p className={styles.currentUser}>
                {
                  isAuth ?
                    <Link to={`/u/${currentUser.username}`}>{currentUser.username}</Link>
                    :
                    <span>游客</span>
                }
              </p>
              <p className={styles.btns}>
                <Button className={styles.reset} size="small" onClick={this.resetComment}>重置</Button>
                <Button type="primary" htmlType="submit" className={styles.submit} size="small">提交评论</Button>
              </p>
            </div>
          </Form>
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
