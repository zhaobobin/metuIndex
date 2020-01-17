/**
 * QuestionModal 提问
 */
import React from 'react'
import {connect} from 'dva'
import { Modal, Button, Form, Input, Select } from 'antd'
import { getRichText } from "@/utils/utils"
import styles from './QuestionModal.less'

import {Toast} from '@/components'
import PublishEditor from '@/containers/Publish/PublishEditor';

const FormItem = Form.Item
const { Option } = Select;

@connect(state => ({
  global: state.global,
  publish: state.publish,
  question: state.question,
}))
@Form.create()
export default class QuestionModal extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      visible: false,
      placeholder: '输入问题的背景、条件等详细信息',

    };
  }

  componentDidMount(){
    if(this.props.onRef) this.props.onRef(this)
  }

  show = () => {
    this.setState({
      visible: true
    })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  cancel = () => {
    // 暂存输入
    const values = this.props.form.getFieldsValue()
    this.props.dispatch({
      type: 'publish/saveQuestion',
      payload: values
    });
    this.hide();
  }

  //确定发表问题
  submitForm = (e) => {

    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const { publish } = this.props;

    this.props.form.validateFields('', (err, values) => {
      if(!err){
        if(publish.question.content) {
          values.content = publish.question.content;
          values.description = getRichText(publish.question.content)
        }
        if(publish.question.thumb) values.thumb = publish.question.thumb;
        this.saveQuestion(values)
      }else{
        this.ajaxFlag = true;
      }
    });

  }

  // 增加问题
  saveQuestion = (values) => {

    this.props.dispatch({
      type: 'global/request',
      url: '/questions',
      method: 'POST',
      payload: values,
      callback: (res) => {
        if (res.code === 0) {
          this.queryPhotoList();
          this.hide();
        } else {
          Toast.info(res.message, 2)
        }
        setTimeout(() => { this.ajaxFlag = true }, 500)
      }
    })
  }

  queryPhotoList(){
    let { url, category, page, per_page } = this.props.question;
    this.props.dispatch({
      type: 'question/list',
      url,
      method: 'GET',
      payload: {
        category,
        page,
        per_page
      },
    });
  }

  render(){

    const { visible } = this.state;
    const { question } = this.props.publish;
    const {getFieldDecorator} = this.props.form;

    // 话题option
    const topics = ['人像', '风光', '街拍', '城市', '旅行', '纪实', '色彩', '手机', '黑白', '胶片', '抓拍'];
    const topicsOption = topics.map((topic, index) => (
      <Option key={index} value={topic}>{topic}</Option>
    ));

    return(
      <Modal
        title=""
        width={600}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
        visible={visible}
        onCancel={this.cancel}
        wrapClassName={styles.questionModal}
      >
        <div className={styles.container}>
          <Form onSubmit={this.submitForm}>

            <FormItem>
              {getFieldDecorator('title', {
                initialValue: question.title || '',
                rules: [
                  { required: true, message: '请输入问题标题！' },
                  { max: 30, message: '不能超过30字！' }
                ],
              })(
                <Input
                  autoFocus
                  allowClear
                  size="large"
                  placeholder="写下你的问题，准确地描述问题更容易得到解答"
                  ref={c => this.titleRef = c}
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('topics', {
                initialValue: question.topics || undefined,
              })(
                <Select
                  mode="tags"
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="请输入话题，并以逗号隔开"
                  tokenSeparators={[',', '，']}
                >
                  {topicsOption}
                </Select>
              )}
            </FormItem>

            <FormItem>
              <div className={styles.editor}>
                <PublishEditor height={200} model="Question" content={question.content}/>
              </div>
            </FormItem>

            <div className={styles.action}>
              <p className={styles.btns}>
                <Button type="primary" htmlType="submit" className={styles.submit}>发布问题</Button>
              </p>
            </div>

          </Form>
        </div>
      </Modal>
    )
  }

}
