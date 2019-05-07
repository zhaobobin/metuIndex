import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Checkbox, notification } from 'antd';
import { ENV, Storage, hasErrors } from "~/utils/utils";
import styles from './UserSign.less'

import InputMobile from '~/components/Form/InputMobile'
import InputPassword from '~/components/Form/InputPassword'
import InputSmscode from '~/components/Form/InputSmscode'
import UserWechatLogin from './UserWechatLogin'

const FormItem = Form.Item;
const keys1 = ['tel', 'password'];
const keys2 = ['tel', 'smscode'];

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

  // 切换登录方式
  changeLoginType = (loginType) => {
    this.resetForm();
    this.setState({
      loginType
    })
  };

  //手机号
  mobileCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'tel': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'tel': value});
      this.props.form.validateFields(['tel'], (err, values) => {});
    }
  };

  //密码
  passwordCallback = (value) => {
    this.props.form.setFieldsValue({'password': value});
    this.props.form.validateFields(['password'], (err, values) => {});
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

  //记住账号
  rememberChange = () => {
    let rememberState = !this.state.remember;
    Storage.set(ENV.storageRemenber, rememberState);
    this.setState({remember: rememberState});
  };

  //确定
  submit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { userType, loginType } = this.state;
    let keys = loginType === 'psd' ? keys1 : keys2;

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        if(values.remember){
          Storage.set(ENV.storageLastTel, values.tel)
        }else{
          Storage.set(ENV.storageLastTel, '')
        }
        values.userType = userType;
        values.loginType = loginType;
        this.login(values);
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });
  };

  //登录
  login = (values) => {
    this.props.dispatch({
      type: 'global/login',
      payload: values,
      callback: (res) => {
        if(res.status === 1) {
          this.props.callback();
        }else{
          notification.error({
            message: '登录失败',
            description: res.msg,
          });
        }
      }
    });
  };

  toRegister = () => {
    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: true,
        signTabKey: '2',
      }
    });
  };

  render(){

    const { loginType } = this.state;
    const { lastTel } = this.props.global;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    return(
      <div className={styles.sign}>

        <div className={styles.form}>

          <h4>
            <p>
              <span>推荐使用</span>
              <span onClick={() => this.changeLoginType('scan')} className={styles.scan}>
                <Icon type="scan" /> 微信扫码
              </span>
              <span>登录 , 安全快捷</span>
            </p>
            <hr/>
          </h4>

          <p className={styles.loginType}>
            <a>
              {
                loginType === 'psd' ?
                  <span onClick={() => this.changeLoginType('sms')}>短信快速登录</span>
                  :
                  <span onClick={() => this.changeLoginType('psd')}>账号密码登录</span>
              }
            </a>
          </p>

          <Form onSubmit={this.submit}>

            <FormItem>
              {getFieldDecorator('tel', {
                initialValue: lastTel,
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[0-9]{10}$/, message: '手机号输入有误' }
                ],
              })(
                <InputMobile default={lastTel} callback={this.mobileCallback}/>
              )}
            </FormItem>

            {
              loginType === 'psd' ?
                <FormItem>
                  {getFieldDecorator('password', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码长度只能在6-20位字符之间' },
                      { max: 20, message: '密码长度只能在6-20位字符之间' },
                      // { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字' }
                    ],
                  })(
                    <InputPassword callback={this.passwordCallback}/>
                  )}
                </FormItem>
                :
                <FormItem>
                  {getFieldDecorator('smscode', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '请输入验证码' },
                      { pattern: /^[0-9]{6}$/, message: '短信验证码错误' },
                    ]
                  })(
                    <InputSmscode
                      tel={hasErrors(getFieldsError(['tel'])) ? '' : getFieldValue('tel')}
                      callback={this.smscodeCallback}
                    />
                  )}
                </FormItem>
            }

            {
              loginType === 'psd' ?
                <FormItem style={{height: '40px'}}>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: this.state.remember,
                  })(
                    <Checkbox onChange={this.rememberChange}>记住账号</Checkbox>
                  )}
                  <a className={styles.forgotPsd}>忘记密码</a><br/>
                </FormItem>
                :
                <FormItem style={{height: '40px'}}>
                  <p>注意：未注册过的手机号，系统将会自动创建新账号</p>
                </FormItem>
            }

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={styles.btn}
              style={{marginBottom: '20px'}}
            >
              登录
            </Button>

          </Form>

          <div className={styles.loginShare}>
            <h4>
              <p>第三方登录</p>
              <hr/>
            </h4>
            <p>
              <a
                className={styles.wechat}
                // onClick={this.wechatLogin}
                onClick={() => this.changeLoginType('scan')}
              >
                <Icon type="wechat" />
              </a>
              <a className={styles.weibo}>
                <Icon type="weibo" />
              </a>
              <a className={styles.qq}>
                <Icon type="qq" />
              </a>
            </p>
          </div>

          {
            loginType === 'scan' ?
              <div className={styles.loginScan}>
                <UserWechatLogin/>
              </div>
              :
              null
          }

        </div>

        <div className={styles.foot}>
          <p className={styles.loginChange}>
            <a className={styles.l} onClick={this.toRegister}>
              <span>注册新账号</span>
            </a>
            <a className={styles.r}>
              {
                loginType === 'psd' ?
                  <span onClick={() => this.changeLoginType('scan')}>切换到二维码登录</span>
                  :
                  <span onClick={() => this.changeLoginType('psd')}>切换到账号登录</span>
              }
            </a>
          </p>
        </div>
      </div>
    )
  }

}
