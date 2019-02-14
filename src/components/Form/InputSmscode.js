/**
 * 表单 - 短信验证码
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Button, notification } from 'antd';
import {filterTel} from '~/utils/utils'
import styles from './InputSmscode.less';

let timer;

@connect(state => ({
  global: state.global
}))
export default class InputSmscode extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      btnText: '获取验证码',
    }
  }

  //改变输入值
  changeValue = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g,'');
    this.setState({ value });
    this.props.callback(value);
  };

  //获取短信验证码
  getCode = (e) => {
    e.preventDefault();

    let {tel, captcha} = this.props;
    if(!tel) {
      this.props.callback('telError');
      return;
    }
    if(!captcha) {
      this.props.callback('captchaError');
      return;
    }
    if(this.state.btnText !== '获取验证码') return;

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: 'api/smsCode',
      payload: {
        tel,
        captcha,
        userType: 'user'
      },
      callback: (res) => {
        if (res.status === 1) {
          this.interval();                                      //执行倒计时
          this.props.callback('clearError');
          notification.success({
            message: '验证码发送成功',
            description: `已将短信验证码发送到您${filterTel(tel)}的手机当中，请注意查收！`
          });
        }else{
          notification.error({
            message: res.msg
          });
        }
      }
    });

    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //短信倒计时
  interval(){
    let num = 60;
    this.setState({btnText: '重新发送(' + num + 's)'});
    timer = setInterval(() => {
      if(num === 1){
        this.ajaxFlag = true;
        this.setState({btnText: '获取验证码'});
        clearInterval(timer);
      }else{
        num--;
        this.setState({btnText: '重新发送(' + num + 's)'});
      }
    }, 1000)
  }

  render(){

    const {value, btnText} = this.state;

    return(
      <div className={styles.smscode}>
        <Input
          size="large"
          maxLength="6"
          autoComplete="off"
          placeholder="短信验证码"
          onChange={this.changeValue}
          value={value}
        />
        <a
          className={styles.btn}
          onClick={this.getCode}
        >
          {btnText}
        </a>
      </div>
    )
  }

}
