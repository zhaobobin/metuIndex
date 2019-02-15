import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Icon, Button, Checkbox, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import { hasErrors } from '~/utils/utils'
import styles from './UserSign.less'

import InputMobile from '~/components/Form/InputMobile'
import InputPassword from '~/components/Form/InputPassword'
import InputSmscode from '~/components/Form/InputSmscode'

const FormItem = Form.Item;
const keys = ['tel', 'password', 'captcha', 'smscode'];

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

  //确定
  submit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        this.register(values);
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });
  };

  //注册
  register = (values) => {
    this.props.dispatch({
      type: 'global/register',
      payload: {
        userType: this.state.userType,
        tel: values.tel,
        password: values.password,
        smscode: values.smscode,
      },
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
  };

  toLogin = () => {
    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: true,
        signTabKey: '1',
      }
    });
  };

  render(){

    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    return(
      <div className={styles.sign}>

        <div className={styles.form}>

          <h4>
            <p>快速注册</p>
            <hr/>
          </h4>

          <Form onSubmit={this.submit} className={styles.register}>
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
                  callback={this.smscodeCallback}
                />
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

            <p>已有账号？返回 <a onClick={this.toLogin} className={styles.blue}>登录</a></p>

          </Form>
        </div>

      </div>
    )
  }

}
