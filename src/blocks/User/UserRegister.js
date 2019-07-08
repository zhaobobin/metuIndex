/**
 * 用户注册 - 模块
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, notification } from 'antd';
import { hasErrors } from '@/utils/utils'
import { Encrypt } from '@/utils/crypto'
import styles from './UserSign.less'

import InputMobile from '@/components/Form/InputMobile'
import InputText from '@/components/Form/InputText'
import InputPassword from '@/components/Form/InputPassword'
import InputSmscode from '@/components/Form/InputSmscode'
import FormXieyi from '@/components/Form/FormXieyi'

const FormItem = Form.Item;

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
    }
  }

  resetForm = () => {
    this.props.form.resetFields();
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
      // this.props.form.validateFields(['tel'], (err, values) => {});
    }
  };

  //昵称
  nicknameCallback = (value) => {
    this.props.form.setFieldsValue({'nickname': value});
    this.props.form.validateFields(['nickname'], (err, values) => {});
  };

  //短信验证码回调
  smscodeCallback = (value, err) => {
    //清空错误提示
    if(err === 'telError'){
      this.props.form.setFields({
        'tel': {
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

  //密码
  passwordCallback = (value) => {
    this.props.form.setFieldsValue({'password': value});
    this.props.form.validateFields(['password'], (err, values) => {});
  };

  //协议
  xieyiCallback = (value) => {
    this.props.form.setFieldsValue({'xieyi': value});
  };

  //确定
  submit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        values.password = Encrypt(values.tel, values.password);
        this.register(values);
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });
  };

  //注册
  register = (values) => {

    let data = {
      registerType: 'psd',                // 注册方式
      userType: this.state.userType,
      ...values
    };

    // 第三方登录
    let {wechat_userinfo, weibo_userinfo, qq_userinfo} = this.props;

    // 微信
    if(wechat_userinfo) {
      data.registerType = 'wechat';
      data.wechat_openid = wechat_userinfo.openid;
      data.gender = wechat_userinfo.gender;
      data.userpic = wechat_userinfo.profile_image_url;
    }

    // 微博
    if(weibo_userinfo) {
      data.registerType = 'weibo';
      data.weibo_uid = weibo_userinfo.uid;
      data.gender = weibo_userinfo.sex;
      data.userpic = weibo_userinfo.headimgurl;
    }

    // QQ
    if(qq_userinfo) {
      data.registerType = 'qq';
      data.qq_openid = qq_userinfo.openid;
      data.gender = qq_userinfo.gender;
      data.userpic = qq_userinfo.figureurl_2;
    }
    // 第三方登录 end!!!

    this.props.dispatch({
      type: 'global/register',
      payload: data,
      callback: (res) => {
        if (res.status === 1) {
          this.props.callback();
        }else{
          if(res.status > 10000) {
            this.setInputError(res.status, res.msg);
          }else{
            notification.error({
              message: '注册失败',
              description: res.msg,
            });
          }
        }
      }
    });
  };

  setInputError = (status, msg) => {
    let key;
    switch(status){
      case 10001: key = 'tel'; break;
      case 10002: key = 'password'; break;
      case 10003: key = 'nickname'; break;
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

  toLogin = () => {

    let {showType} = this.props;
    if(showType){
      this.props.dispatch({
        type: 'global/changeSignModal',
        payload: {
          signModalVisible: true,
          signTabKey: '1',
        }
      });
    }else{
      this.props.dispatch(routerRedux.push('/user/login'));
    }

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
                rules: [
                  { required: true, message: '请输入手机号' }
                ],
              })(
                <InputMobile callback={this.mobileCallback}/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('nickname', {
                initialValue: this.props.nickname || '',
                validateFirst: true,
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入昵称' },
                  { pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,10}$/, message: '只能输入汉子、字母、数字、下划线，2-10位' }
                ],
              })(
                <InputText defaultVaule={this.props.nickname} placeholder="昵称" callback={this.nicknameCallback}/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('password', {
                validateFirst: true,
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入密码' },
                  { pattern: /^[A-Za-z0-9]{6,20}/, message: '只能输入6到20位到字母或数字组合' }
                ],
              })(
                <InputPassword showPsdLevel={true} callback={this.passwordCallback}/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('smscode', {
                rules: [
                  { required: true, message: '请输入验证码' },
                ]
              })(
                <InputSmscode
                  tel={hasErrors(getFieldsError(['tel'])) ? '' : getFieldValue('tel')}
                  callback={this.smscodeCallback}
                />
              )}
            </FormItem>

            <FormItem style={{height: '40px'}}>
              {getFieldDecorator('xieyi', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <FormXieyi callback={this.xieyiCallback}/>
              )}
            </FormItem>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={styles.btn}
              style={{marginBottom: '10px'}}
              disabled={!getFieldValue('xieyi')}
            >
              注册
            </Button>

            <p>已有账号？返回 <a onClick={this.toLogin} className={styles.blue}>登录</a></p>

          </Form>
        </div>

      </div>
    )
  }

}
