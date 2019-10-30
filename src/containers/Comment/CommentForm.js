import React from 'react'
import {connect} from 'dva'
import { Link } from 'dva/router';
import {Button, Form, Icon, Input, notification} from 'antd'
import {filterStr} from "@/utils/utils"
import styles from './CommentList.less'

import {Toast} from '@/components'
import SignAuth from '@/blocks/Auth/SignAuth'

const FormItem = Form.Item
const {TextArea} = Input

@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class CommentForm extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      placeholder: '写下您的评论...',
    };
  }

  //检查登录状态
  checkLogin = () => {
    return this.signAuth.check();
  };

  focusHandle = () => {
    this.checkLogin();
  };

  blurHandle = () => {

  };

  //确定发表评论
  commentSubmit = (e) => {

    e.preventDefault();
    if (!this.checkLogin()) return;												      //检查登录状态

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        let content = filterStr(values.content).trim(); // 过滤特殊符号及两端空格
        if (content === '') {
          this.props.form.setFields({
            'content': {
              value: '',
              errors: [new Error('请输入评论内容！')]
            }
          });
        } else {
          this.addComment(content)
        }
      }
    })
  }

  //增加评论
  addComment = (content) => {

    if (!this.ajaxFlag) return
    this.ajaxFlag = false

    const { article_id } = this.props;
    const { currentUser } = this.props.global;

    let data = {
      commentator: currentUser._id,
      article_id,
      content,
    }
    if (this.state.commentId) data.commentId = this.state.commentId			    //被回复的评论id
    if (this.state.reply_to) data.reply_to = this.state.reply_to			      //被回复的用户id

    this.props.dispatch({
      type: 'global/request',
      url: '/comments',
      method: 'POST',
      payload: data,
      callback: (res) => {
        if (res.status === 1) {
          this.props.form.resetFields()
        } else {
          Toast.info(res.message, 2)
        }
        setTimeout(() => { this.ajaxFlag = true }, 500)
      }
    })
  }

  //回复评论
  replyComment(topic, item) {

    let nickname = item ? item.author.nickname : topic.author.nickname,
      placeholder = '回复：' + nickname

    this.inputRef.focus()
    this.setState({
      commentId: topic._id,
      reply_to: item ? item.author._id : '',
      placeholder: placeholder
    })
  }

  resetComment = (e) => {
    this.props.form.resetFields();
    this.setState({commentId: '', reply_to: '', placeholder: '写下您的评论...'});
  };

  render() {

    const {isAuth, currentUser} = this.props.global
    const {getFieldDecorator} = this.props.form

    return (
      <Form onSubmit={this.commentSubmit}>

        <FormItem ref="textarea">
          {getFieldDecorator('content', {
            rules: [
              { required: true, message: '请输入评论内容！' },
              { max: 100, message: '不能超过100字！' }
            ],
          })(
            <TextArea
              autosize={{minRows: 2, maxRows: 4}}
              placeholder={this.state.placeholder}
              ref={c => this.inputRef = c}
              onFocus={this.focusHandle}
              onBlur={this.blurHandle}
            />
          )}
        </FormItem>

        <div className={styles.action}>
          <p className={styles.currentUser}>
            {
              isAuth ?
                <Link to={`/users/${currentUser.username}`}>{currentUser.username}</Link>
                :
                <span>游客</span>
            }
          </p>
          <p className={styles.btns}>
            <Button className={styles.reset} size="small" onClick={this.resetComment}>重置</Button>
            <Button type="primary" htmlType="submit" className={styles.submit} size="small">提交评论</Button>
          </p>
        </div>

        <SignAuth onRef={ref => this.signAuth = ref} />

      </Form>
    )
  }

}
