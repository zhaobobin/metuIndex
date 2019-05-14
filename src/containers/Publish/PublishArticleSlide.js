/**
 * 发布 - 表单数据提交
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Button, Modal, notification } from 'antd';
import { hasErrors } from '~/utils/utils';
import styles from './PublishSlide.less';

import UploadPhoto from '~/components/Form/UploadPhoto'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
  },
};

const keys = ['title', 'description', 'tags', 'copyright', 'allow_comment'];

@connect(state => ({
  global: state.global,
  publish: state.publish
}))
@Form.create()
export default class PublishRight extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      detail: ''
    }
  }

  //选择缩略图
  handleSelectPhoto = (url) => {
    this.props.form.setFieldsValue({
      thumb: url
    });
    this.props.dispatch({
      type: 'publish/changeModelType',
      payload: {
        thumb: url
      }
    })
  };

  formSubmit = (e) => {
    e.preventDefault();
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const {content, thumb} = this.props.publish;

    this.props.form.validateFields(keys, (err, values) => {
      if(!err){
        values.uid = this.props.global.currentUser._id;
        values.content = this.props.publish.content;
        values.thumb = this.props.publish.thumb || '';
        if(values.tags) values.tags = values.tags.join(',');
        this.saveData(values)
      }else{
        this.ajaxFlag = false;
      }
    });

  };

  //保存数据
  saveData(params){
    let api = '',
      id = this.props.id;
    if(id){
      api = 'api/ArticleUpdate';
      params.id = id;
    }else{
      api = 'api/ArticleAdd';
    }
    //保存时，执行ossDel列表对应文件的删除操作
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: params,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.status === 1){
          this.props.form.resetFields();
          this.props.dispatch(routerRedux.push('/u/'+this.props.global.currentUser.username));
        }else{
          notification.error({message: res.msg});
        }
      }
    });
  }

  //取消
  formCancel = (e) => {
    e.preventDefault();
    confirm({
      title: '取消编辑?',
      okText: '确定',
      cancelText: '取消',
      content: '所有未保存的数据都将被清除！',
      onOk() {
        window.history.go(-1)
      },
      onCancel() {},
    });
  };

  render(){

    const { detail } = this.state;
    const { global, form } = this.props;
    const { getFieldDecorator, getFieldsError } = form;

    //标签option
    const tags = ['人像', '风光', '街拍', '城市', '旅行', '纪实', '色彩', '手机', '黑白', '胶片', '抓拍'];
    const tagsOption = tags.map((topic, index) => (
      <Option key={index} value={topic}>{topic}</Option>
    ));

    //版权option
    const copyright = [
      {label: '非原创', value: 0},
      {label: '原创,CC0协议共享(非署名)', value: 1},
      {label: '原创,CC协议共享(署名)', value: 2},
      {label: '原创,CC协议共享(署名-非商业性使用)', value: 3},
      {label: '原创,CC协议共享(署名-禁止演绎)', value: 4},
      {label: '原创,CC协议共享(署名-相同方式共享)', value: 5},
      {label: '原创,CC协议共享(署名-非商业性使用-禁止演绎)', value: 6},
      {label: '原创,CC协议共享(署名-非商业性使用-相同方式共享)', value: 7}
    ];
    const copyrightOption = copyright.map((topic, index) => (
      <Option key={index} value={topic.value}>{topic.label}</Option>
    ));

    return(
      <div className={styles.slide}>

        <Form onSubmit={this.formSubmit} onReset={this.formCancel}>

          <FormItem label="缩略图">
            {getFieldDecorator('thumb', {})(
              <UploadPhoto category="thumb" url="" callback={this.handleSelectPhoto}/>
            )}
          </FormItem>

          <FormItem label="标题">
            {getFieldDecorator('title', {
              initialValue: detail.title ? detail.title : undefined,
              rules: [
                { required: true, message: '请输入文章标题！' },
                { max: 20, message: '标题长度不能超过20个字！' },
                { pattern: /^[\u0391-\uFFE5A-Za-z0-9,.]+$/, message: '不能输入特殊符号！' }
              ],
            })(
              <Input
                size="large"
                autoComplete="off"
                style={{ width: '100%' }}
                placeholder="标题长度不能超过20个字"
              />
            )}
          </FormItem>

          <FormItem label="描述">
            {getFieldDecorator('description', {
              initialValue: detail.description ? detail.description : undefined,
              rules: [
                { max: 200, message: '描述长度不能超过200个字！' },
              ],
            })(
              <TextArea
                style={{ width: '100%' }}
                placeholder="描述长度不能超过200个字"
                autosize={{ minRows: 2, maxRows: 4 }}
              />
            )}
          </FormItem>

          <FormItem label="标签">
            {getFieldDecorator('tags', {
              initialValue: detail.tags ? detail.tags.split(',') : undefined,
            })(
              <Select
                mode="tags"
                size="large"
                style={{ width: '100%' }}
                placeholder="请输入标签，并以逗号隔开"
                tokenSeparators={[',', '，']}
              >
                {tagsOption}
              </Select>
            )}
          </FormItem>

          <FormItem label="版权">
            {getFieldDecorator('copyright', {
              initialValue: detail.copyright ? detail.copyright : undefined
            })(
              <Select
                size="large"
                placeholder="请选择"
              >
                {copyrightOption}
              </Select>
            )}
          </FormItem>

          <Button
            className={styles.submit}
            size="large"
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError(keys)) || global.submitting}
          >
            发布
          </Button>
        </Form>

      </div>
    )
  }

}
