/**
 * CommentModal
 */
import React from 'react'
import {connect} from 'dva'
import { Modal, Button, Form, Icon, Input } from 'antd'
import {filterStr} from "@/utils/utils"
import styles from './CommentModal.less'

import {Toast} from '@/components'

const FormItem = Form.Item
const {TextArea} = Input

@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class CommentModal extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      visible: false,
      placeholder: '写下您的评论...',

      category: '',
      detail_id: '',
      root_comment_id: '',
      reply_to: '',
    };
  }

  componentDidMount(){
    if(this.props.onRef) this.props.onRef(this)
  }

  show = (params) => {
    this.setState({
      visible: true,
      ...params
    })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  //确定发表评论
  submitForm = (e) => {

    e.preventDefault();

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
        this.contentRef.focus()
      }
    })
  }

  //增加评论
  addComment = (content) => {

    if (!this.ajaxFlag) return
    this.ajaxFlag = false

    const { category, detail_id, root_comment_id, reply_to } = this.state;

    this.props.dispatch({
      type: 'global/request',
      url: `/${category}/${detail_id}/comments`,
      method: 'POST',
      payload: {
        content,
        root_comment_id,
        reply_to
      },
      callback: (res) => {
        if (res.code === 0) {
          this.props.callback(res.data);
          this.hide();
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

  render(){

    const { visible, placeholder } = this.state;
    const {getFieldDecorator} = this.props.form;

    return(
      <Modal
        title="评论"
        width={500}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
        visible={visible}
        onCancel={this.hide}
      >
        <div className={styles.container}>
          <Form onSubmit={this.submitForm}>

            <FormItem ref="textarea">
              {getFieldDecorator('content', {
                rules: [
                  { required: true, message: '请输入评论内容！' },
                  { max: 100, message: '不能超过100字！' }
                ],
              })(
                <TextArea
                  autoFocus
                  allowClear
                  autoSize={{minRows: 4, maxRows: 6}}
                  placeholder={placeholder}
                  ref={c => this.contentRef = c}
                />
              )}
            </FormItem>

            <div className={styles.action}>
              <p className={styles.btns}>
                <Button type="primary" htmlType="submit" className={styles.submit}>评论</Button>
              </p>
            </div>

          </Form>
        </div>
      </Modal>
    )
  }

}
