/**
 * 用户登录 - 模块
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Button, Checkbox } from 'antd';
import { ENV, Storage, Validator, Encrypt } from '@/utils';
import styles from './UserSign.less';

import InputMobile from '@/components/Form/InputMobile'
import InputPassword from '@/components/Form/InputPassword'
import InputSmscode from '@/components/Form/InputSmscode'
import UserWechatLogin from './UserWechatLogin'

const FormItem = Form.Item;
const keys1 = ['mobile', 'password'];
const keys2 = ['mobile', 'smscode'];

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class UserLogin extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loginType: 'psd',                               //登录方式

      remember: Storage.get(ENV.storage.remenber) !== null ? Storage.get(ENV.storage.remenber) : true,

      errorCount: 0,                                  //表单输入错误次数
    }
  }

  componentDidMount(){

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

  // 微信登录
  wechatLogin = () => {
    // this.resetForm();
    this.setState({
      loginType: 'scan'
    })
  };

  // 微博登录
  weiboLogin = () => {
    const WeiboLoginState = Encrypt('Weibologin', ('metuwang' + Math.random()));
    Storage.set(ENV.storage.weiboLoginState, WeiboLoginState);

    let url = 'https://api.weibo.com/oauth2/authorize?';
    let params = {
      response_type: 'code',
      client_id: '1779469029',
      redirect_uri: encodeURI('https://www.metuwang.com/callback/weiboLogin'),
      state: WeiboLoginState
    };
    for (let i in params) {
      url += (i + '=' + params[i] + '&');
    }
    url = url.substring(0, url.lastIndexOf('&'));
    window.location.href = url;
    // openwindow(url, 'TencentLogin', 650, 600);
  };

  // QQ登录
  qqLogin = () => {
    const QqLoginState = Encrypt('Qqlogin', ('metuwang' + Math.random()));
    Storage.set(ENV.storage.qqLoginState, QqLoginState);

    let url = 'https://graph.qq.com/oauth2.0/authorize?';
    let params = {
      response_type: 'code',
      client_id: '101551625',
      redirect_uri: encodeURI('https://www.metuwang.com/callback/qqLogin'),
      state: QqLoginState
    };
    for (let i in params) {
      url += (i + '=' + params[i] + '&');
    }
    url = url.substring(0, url.lastIndexOf('&'));
    window.location.href = url;
  };

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
    }
  };

  //密码
  passwordCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'password': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'password': value});
      // this.props.form.validateFields(['password'], (err, values) => {});
    }
  };

  //短信验证码回调
  smscodeCallback = (value, err) => {
    //清空错误提示
    if(err === 'telError'){
      this.props.form.setFields({
        'mobile': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
      this.setState({smscodeSended: true});
    }
    else if(err === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
      this.setState({smscodeSended: true});
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

  //记住账号
  rememberChange = () => {
    let rememberState = !this.state.remember;
    Storage.set(ENV.storage.remenber, rememberState);
    this.setState({remember: rememberState});
  };

  //确定
  submit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { loginType } = this.state;
    let keys = loginType === 'psd' ? keys1 : keys2;

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        if(values.remember){
          Storage.set(ENV.storage.lastTel, values.mobile)
        }else{
          Storage.set(ENV.storageLastTel, '')
        }
        if(values.password) values.password = Encrypt(values.mobile, values.password);
        if(values.smscode) values.smscode = Encrypt(values.mobile, values.smscode);
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
        if(res.code === 0) {
          this.props.callback();
        }else{
          this.props.form.setFields({
            [res.error_key]: {
              value: '',
              errors: [new Error(res.message)]
            }
          });
        }
      }
    });
  };

  setInputError = (status, msg) => {
    let key;
    switch(status){
      case 10001: key = 'mobile'; break;
      case 10002: key = 'password'; break;
      case 10003: key = 'mobile'; break;
      case 10004: key = 'smscode'; break;
      default: break;
    }
    this.props.form.setFields({
      [key]: {
        value: '',
        errors: [new Error(msg)]
      }
    });
  };

  toRegister = () => {

    let {showType} = this.props;
    if(showType){
      this.props.dispatch({
        type: 'global/changeSignModal',
        payload: {
          signModalVisible: true,
          signTabKey: '2',
        }
      });
    }else{
      this.props.dispatch(routerRedux.push('/user/register'));
    }

  };

  toPsdReset = () => {

    let {showType} = this.props;
    if(showType){
      this.props.dispatch({
        type: 'global/changeSignModal',
        payload: {
          signModalVisible: false,
          signTabKey: '1',
        }
      });
    }

    this.props.dispatch(routerRedux.push('/user/reset'));
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
              {getFieldDecorator('mobile', {
                initialValue: lastTel,
                rules: [
                  { required: true, message: '请输入手机号' },
                ],
              })(
                <InputMobile autoFocus={true} default={lastTel} callback={this.mobileCallback}/>
              )}
            </FormItem>

            {
              loginType === 'psd' ?
                <FormItem>
                  {getFieldDecorator('password', {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请输入密码' },
                    ],
                  })(
                    <InputPassword hidePsdLevel={true} callback={this.passwordCallback}/>
                  )}
                </FormItem>
                :
                <FormItem>
                  {getFieldDecorator('smscode', {
                    rules: [
                      { required: true, message: '请输入验证码' },
                    ]
                  })(
                    <InputSmscode
                      type="login"
                      mobile={Validator.hasErrors(getFieldsError(['mobile'])) ? '' : getFieldValue('mobile')}
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
                  <a className={styles.forgotPsd} onClick={this.toPsdReset}>忘记密码</a><br/>
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
              disabled={
                Validator.hasErrors(getFieldsError()) ||
                !getFieldValue('mobile') ||
                !getFieldValue(loginType === 'psd' ? 'password' : 'smscode')
              }
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
              <a className={styles.wechat} onClick={this.wechatLogin}>
                <Icon type="wechat" />
              </a>
              <a className={styles.weibo} onClick={this.weiboLogin}>
                <Icon type="weibo" />
              </a>
              <a className={styles.qq} onClick={this.qqLogin}>
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
