import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Icon, Button, Checkbox, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import {ENV, Storage} from "~/utils/utils";
import styles from './UserLogin.less'

import InputMobile from '~/components/Form/InputMobile'
import InputPassword from '~/components/Form/InputPassword'
import InputCaptcha from '~/components/Form/InputCaptcha'

const FormItem = Form.Item;
const keys = ['tel', 'password', 'captcha', 'remember'];

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class UserLogin extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      userType: 'user',                               //用户类型
      loginType: 'psd',                               //登录方式

      remember: Storage.get(ENV.storageRemenber) !== null ? Storage.get(ENV.storageRemenber) : true,

      errorCount: 0,                                  //表单输入错误次数
    }
  }

  //重置表单
  resetForm = () => {
    this.props.form.resetFields();
  };

  //手机号
  mobileCallback = (value) => {
    this.props.form.setFieldsValue({'tel': value});
    this.props.form.validateFields(['tel'], (err, values) => {});
  };

  //密码
  passwordCallback = (value) => {
    this.props.form.setFieldsValue({'password': value});
    this.props.form.validateFields(['password'], (err, values) => {});
  };

  //图形验证码
  captchaCallback = (value) => {
    this.props.form.setFieldsValue({'captcha': value});
    this.props.form.validateFields(['captcha'], (err, values) => {});
  };

  //记住账号
  rememberChange = () => {
    let rememberState = !this.state.remember;
    Storage.set(ENV.storageRemenber, rememberState);
    this.setState({remember: rememberState});
  };

  //登录
  loginSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        if(values.remember){
          Storage.set(ENV.storageLastTel, values.tel)
        }else{
          Storage.set(ENV.storageLastTel, '')
        }
        this.props.dispatch({
          type: 'global/login',
          payload: {
            ...values,
            userType: this.state.userType,
            loginType: this.state.loginType,
            captcha: parseInt(values.captcha, 10)
          },
          callback: (res) => {
            if(res.status === 1) {
              this.props.callback();
            }else{
              this.getCaptcha();
              notification.error({
                message: '登录失败！',
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

    const { lastTel } = this.props.global;
    const { getFieldDecorator } = this.props.form;

    return(
      <Form onSubmit={this.loginSubmit} className={styles.login}>
        <FormItem>
          {getFieldDecorator('tel', {
            initialValue: lastTel,
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
          {getFieldDecorator('captcha', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入验证码' },
              { len: 4, message: '请输入验证码' },
            ]
          })(
            <InputCaptcha callback={this.captchaCallback}/>
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: this.state.remember,
          })(
            <Checkbox onChange={this.rememberChange}>记住账号</Checkbox>
          )}
          <a className={styles.forgotPsd}>忘记密码</a><br/>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={styles.btn}
          >
            登录
          </Button>
        </FormItem>
        <FormItem>

        </FormItem>
      </Form>
    )
  }

}
