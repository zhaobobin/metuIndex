import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Icon, Button, Checkbox, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import { hasErrors } from '~/utils/utils'
import styles from './UserRegister.less'

import InputMobile from '~/components/Form/InputMobile'
import InputCaptcha from '~/components/Form/InputCaptcha'
import InputSmscode from '~/components/Form/InputSmscode'
import InputPassword from '~/components/Form/InputPassword'

const FormItem = Form.Item;
const keys = ['tel', 'captcha', 'smscode', 'password'];

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class UserRegister extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      userType: 'user',                               //用户类型
      registerType: 'psd',                            //注册方式

      smscodeSended: false,                           //短信验证码是否已发送
    }
  }

  resetForm = () => {
    this.props.form.resetFields();
  };

  //手机号
  mobileCallback = (value) => {
    this.props.form.setFieldsValue({'tel': value});
    this.props.form.validateFields(['tel'], (err, values) => {});
  };

  //图形验证码
  captchaCallback = (value) => {
    this.props.form.setFieldsValue({'captcha': value});
    this.props.form.validateFields(['captcha'], (err, values) => {});
  };

  //短信验证码回调
  smscodeCallback = (value) => {
    //清空错误提示
    if(value === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
      this.setState({smscodeSended: true});
    }
    else if(value === 'telError'){
      this.props.form.setFields({
        'tel': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
      this.setState({smscodeSended: true});
    }
    else if(value === 'captchaError'){
      this.props.form.setFields({
        'captcha': {
          value: '',
          errors: [new Error('请输入图形验证码')]
        }
      });
      this.setState({smscodeSended: true});
    }
    else{
      this.props.form.setFieldsValue({'smscode': value});
      this.props.form.validateFields(['smscode'], (err, values) => {});
    }
  };

  //密码
  passwordCallback = (value) => {
    this.props.form.setFieldsValue({'password': value});
    this.props.form.validateFields(['password'], (err, values) => {});
  };

  //注册
  regeditSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        //console.log(values)
        let data = {
          userType: this.state.userType,
          tel: values.r_tel,
          captcha: parseInt(values.r_captcha, 10),
          smscode: values.r_smscode,
          password: values.r_password,
        };
        this.props.dispatch({
          type: 'global/register',
          payload: data,
          callback: (res) => {
            if (res.status === 1) {
              this.setUserModal(false, '2');
            }else{
              this.getCaptcha();
              notification.error({
                message: '注册失败！',
                description: res.msg,
              });
            }
          }
        });
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });
  };

  render(){

    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    return(
      <Form onSubmit={this.regeditSubmit} className={styles.register}>
        <FormItem>
          {getFieldDecorator('tel', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入手机号' },
              { pattern: /^1[0-9]{10}$/, message: '手机号输入有误' }
            ],
          })(
            <InputMobile callback={this.mobileCallback}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('captcha', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入验证码' },
              { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字' }
            ]
          })(
            <InputCaptcha callback={this.captchaCallback}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('smscode', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入验证码' },
              { len: 6, message: '手机验证码格式有误' },
              { pattern: /^[0-9]+$/, message: '只能输入数字' }
            ]
          })(
            <InputSmscode
              tel={hasErrors(getFieldsError(['tel'])) ? '' : getFieldValue('tel')}
              captcha={hasErrors(getFieldsError(['captcha'])) ? '' : getFieldValue('captcha')}
              callback={this.smscodeCallback}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度只能在6-20位字符之间' },
              { max: 20, message: '密码长度只能在6-20位字符之间' },
              { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字' }
            ],
          })(
            <InputPassword callback={this.passwordCallback}/>
          )}
        </FormItem>
        <FormItem>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            注册
          </Button>
        </FormItem>
      </Form>
    )
  }

}
