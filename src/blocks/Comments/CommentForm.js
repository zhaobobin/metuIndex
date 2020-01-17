import React from 'react'
import {connect} from 'dva'
import { Link } from 'dva/router';
import { Button, Form, Input } from 'antd'
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

  componentDidMount(){
    if(this.props.onRef) this.props.onRef(this)
  }

  focusHandle = () => {
    this.signAuth.check();
  };

  blurHandle = () => {

  };

  //确定发表评论
  submitForm = (e) => {

    e.preventDefault();
    if (!this.signAuth.check()) return;												      //检查登录状态

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
      } else {
        this.inputRef.focus()
      }
    })
  }

  //增加评论
  addComment = (content) => {

    if (!this.ajaxFlag) return
    this.ajaxFlag = false

    const { category, detail_id } = this.props;

    this.props.dispatch({
      type: 'global/request',
      url: `/${category}/${detail_id}/comments`,
      method: 'POST',
      payload: {
        content
      },
      callback: (res) => {
        if (res.code === 0) {
          this.props.form.resetFields();
          this.props.callback();
        } else {
          Toast.info(res.message, 2)
        }
        setTimeout(() => { this.ajaxFlag = true }, 500)
      }
    })
  }

  resetForm = (e) => {
    this.props.form.resetFields();
    this.setState({commentId: '', reply_to: '', placeholder: '写下您的评论...'});
  };

  render() {

    const {isAuth, currentUser} = this.props.global
    const {getFieldDecorator} = this.props.form

    return (
      <Form onSubmit={this.submitForm}>

        <FormItem ref="textarea">
          {getFieldDecorator('content', {
            rules: [
              { required: true, message: '请输入评论内容！' },
              { max: 100, message: '不能超过100字！' }
            ],
          })(
            <TextArea
              allowClear
              autoSize={{minRows: 2, maxRows: 4}}
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
                <Link to={`/users/${currentUser.username}`}>{currentUser.nickname}</Link>
                :
                <span>游客</span>
            }
          </p>
          <p className={styles.btns}>
            <Button className={styles.reset} size="small" onClick={this.resetForm}>重置</Button>
            <Button type="primary" htmlType="submit" className={styles.submit} size="small">评论</Button>
          </p>
        </div>

        <SignAuth onRef={ref => this.signAuth = ref} />

      </Form>
    )
  }

}
