/**
 * 发布 - 表单数据提交
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Select, Button, Modal, notification } from 'antd';
import styles from './PublishSlide.less';

import PublishConfig from './PublishConfig'
// import UploadPhoto from '~/components/Form/UploadPhoto'
import InputText from '~/components/Form/InputText'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;
const { Option } = Select;

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

  // 标题
  titleCallback = (value) => {
    this.props.form.setFieldsValue({'title': value});
    this.props.form.validateFields(['title'], (err, values) => {});
  };

  // 确定
  formSubmit = (e) => {
    e.preventDefault();
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const {global, publish} = this.props;

    this.props.form.validateFields('', (err, values) => {
      if(!err){
        values.uid = global.currentUser._id;
        for(let i in publish.content){
          delete publish.content[i].loading;
          delete publish.content[i].cover;
          delete publish.content[i].base64;
        }
        values.content = JSON.stringify(publish.content);
        values.thumb = publish.thumb || '';
        if(values.tags) values.tags = values.tags.join(',');
        this.saveData(values)
      }else{
        this.ajaxFlag = true;
      }
    });

  };

  // 保存数据
  saveData(params){
    let api = '',
      id = this.props.id;
    if(id){
      api = 'api/PhotosUpdate';
      params.id = id;
    }else{
      api = 'api/PhotosAdd';
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
          notification.error({message: res.msg || res.msg.message});
        }
      }
    });
  }

  // 取消
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
    const { global, form, publish } = this.props;
    const { getFieldDecorator } = form;

    //标签option
    const tagsOption = PublishConfig.tags.map((topic, index) => (
      <Option key={index} value={topic}>{topic}</Option>
    ));

    //版权option
    const copyrightOption = PublishConfig.copyright.map((topic, index) => (
      <Option key={index} value={topic.value}>{topic.label}</Option>
    ));

    return(
      <div className={styles.slide}>

        <Form
          hideRequiredMark
          onSubmit={this.formSubmit}
          onReset={this.formCancel}
        >

          <FormItem label="标题">
            {getFieldDecorator('title', {
              initialValue: detail.title || undefined,
              validateFirst: true,
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: '请输入文章标题！' },
                { max: 20, message: '标题长度不能超过20个字！' },
              ],
            })(
              <InputText maxLength={20} defaultVaule={this.props.title} placeholder="标题长度不能超过20个字" callback={this.titleCallback}/>
            )}
          </FormItem>

          <FormItem label="描述">
            {getFieldDecorator('description', {
              initialValue: detail.description || undefined,
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
              initialValue: detail.copyright || 1
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
            disabled={!publish.content || global.submitting}
          >
            发布
          </Button>
        </Form>

      </div>
    )
  }

}
