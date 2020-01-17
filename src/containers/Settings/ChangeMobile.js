/**
 * 设置 - 修改手机
 */
import React from 'react';
import {connect} from 'dva';
import { Form, Button, Modal } from 'antd';
import { Validator } from '@/utils';
import styles from './ChangeMobile.less';

import { Toast } from '@/components';
import InputMobile from '@/components/Form/InputMobile';
import InputSmscode from '@/components/Form/InputSmscode';

const FormItem = Form.Item;

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class ChangeMobile extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      title: '绑定手机',
      visible: false
    }
  }

  componentDidMount(){
    this.props.onRef(this)
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

  //手机号
  mobileCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'mobile': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'mobile': value});
      // this.props.form.validateFields(['mobile'], (err, values) => {});
    }
  };

  //短信验证码回调
  smscodeCallback = (value, err) => {
    //清空错误提示
    if(err === 'mobileError'){
      this.props.form.setFields({
        'mobile': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
    }
    else if(err === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
    }
    else if(err === 'smscodeError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: [new Error(!value ? '请输入短信验证码' : '短信验证码格式有误')]
        }
      });
    }
    else{
      this.props.form.setFieldsValue({'smscode': value});
      // this.props.form.validateFields(['smscode'], (err, values) => {});
    }
  };

  submit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        this.save(values)
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });

  }

  save(values){
    this.props.dispatch({
      type: 'global/request',
      url: '/user/changeMobile',
      method: 'POST',
      payload: values,
      callback: (res) => {
        if(res.code === 0) {
          Toast.info(res.message, 2);
          this.hide();
        }else{
          this.props.form.setFields({
            [res.error_key]: {
              value: '',
              errors: [new Error(res.message)]
            }
          });
        }
      }
    })
  }

  render(){

    const { title, visible } = this.state;
    const { currentUser } = this.props.global;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    const subTitle = currentUser.mobile || '未绑定'

    return(
      <Modal
        width={400}
        title={title + " " + subTitle}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        wrapClassName={styles.changeMobile}
        onCancel={this.hide}
      >
        <Form onSubmit={this.submit}>
          <FormItem>
            {getFieldDecorator('mobile', {
              rules: [
                { required: true, message: '请输入手机号' }
              ],
            })(
              <InputMobile callback={this.mobileCallback}/>
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('smscode', {
              rules: [
                { required: true, message: '请输入验证码' },
              ]
            })(
              <InputSmscode
                type="change"
                mobile={Validator.hasErrors(getFieldsError(['mobile'])) ? '' : getFieldValue('mobile')}
                callback={this.smscodeCallback}
              />
            )}
          </FormItem>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
            style={{marginBottom: '10px'}}
            disabled={
              Validator.hasErrors(getFieldsError()) ||
              !getFieldValue('mobile') ||
              !getFieldValue('smscode') ||
              getFieldValue('smscode').length < 6
            }
          >
            提交
          </Button>

        </Form>
      </Modal>
    )
  }

}
