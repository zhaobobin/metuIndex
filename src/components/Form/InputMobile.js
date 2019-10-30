/**
 * 表单 - 手机号
 */
import React from 'react';
import { Input } from 'antd';
import { Validator } from '@/utils';

export default class InputMobile extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: this.props.default || '',            //输入框的值
    }
  }

  // 监控手机号输入
  changeValue = (e) => {
    let value = e.target.value;
    if(value.length === 1 && value !== '1') value = '';
    value = value.replace(/\D/g,'');
    this.setState({ value });
    if(Validator.checkMobile(value)){
      this.props.callback(value);
    }else{
      this.props.callback(value, '请输入正确的手机号');
    }
  };

  // 手机失焦检测
  mobileOnBlur = (e) => {
    let value = e.target.value;
    if(value){
      if(Validator.isMobile(value)){
        this.props.callback(value);
      }else{
        this.props.callback(value, '请输入正确的手机号');
      }
    }else{
      this.props.callback(value, '请输入手机号');
    }
  };

  render(){

    const { value } = this.state;
    const { autoFocus } = this.props;

    return(
      <Input
        size="large"
        maxLength={11}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="手机号"
        onChange={this.changeValue}
        onBlur={this.mobileOnBlur}
        value={value}
        allowClear={true}
      />
    )
  }

}
