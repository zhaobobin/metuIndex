/**
 * 发布 - 表单数据提交
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Select, Button, Modal } from 'antd';
import styles from './PublishSlide.less';

// import UploadPhoto from '@/components/Form/UploadPhoto'
import { Toast } from '@/components'
import InputText from '@/components/Form/InputText'

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

  componentWillUnmount(){
    // 页面卸载时，清空redux
    this.props.dispatch({
      type: 'publish/saveArticle',
      payload: {
        content: '',
        thumb: ''
      }
    });
  }

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

    const { publish } = this.props;

    this.props.form.validateFields('', (err, values) => {
      if(!err){
        values.content = publish.article.content;
        values.thumb = publish.article.thumb;
        if(values.tags) values.tags = values.tags.join(',');
        this.saveArticle(values)
      }else{
        this.ajaxFlag = true;
      }
    });

  };

  // 提交
  saveArticle(values){

    const { currentUser } = this.props.global;
    let id = this.props.id;
    if(id) values.id = id;

    //保存时，执行ossDel列表对应文件的删除操作
    this.props.dispatch({
      type: 'global/request',
      url: '/articles',
      method: id ? 'PATCH' : 'POST',
      payload: values,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.code === 0){
          Toast.info(res.message, 2);
          this.props.form.resetFields();
          this.props.dispatch(routerRedux.push(`/users/${currentUser.username}/articles`));
        }else{
          if(res.error_key){
            this.props.form.setFields({
              [res.error_key]: {
                value: '',
                errors: [new Error(res.message)]
              }
            });
          } else {
            Toast.info(res.message, 2)
          }
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
    const { global, form, publish } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

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

        <Form
          hideRequiredMark
          onSubmit={this.formSubmit}
          onReset={this.formCancel}
        >

          {/*<FormItem label="缩略图">*/}
            {/*{getFieldDecorator('thumb', {})(*/}
              {/*<UploadPhoto category="thumb" url="" callback={this.handleSelectPhoto}/>*/}
            {/*)}*/}
          {/*</FormItem>*/}

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

          <FormItem label="描述" style={{height: 'auto'}}>
            {getFieldDecorator('description', {
              initialValue: detail.description || undefined,
              rules: [
                { max: 200, message: '描述长度不能超过200个字！' },
              ],
            })(
              <TextArea
                style={{ width: '100%' }}
                placeholder="描述长度不能超过200个字"
                autoSize={{ minRows: 2, maxRows: 4 }}
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
            disabled={
              !getFieldValue('title') ||
              !publish.article.content ||
              global.submitting
            }
          >
            发布
          </Button>
        </Form>

      </div>
    )
  }

}
