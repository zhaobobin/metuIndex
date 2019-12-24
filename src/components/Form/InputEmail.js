/**
 * 表单 - 邮箱
 */
import React from 'react';
import { Input } from 'antd';
import { Validator } from '@/utils';

export default class InputEmail extends React.Component {

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
    this.setState({ value });
    if(value){
      this.props.callback(value);
    }else{
      this.props.callback(value, '请输入正确的邮箱');
    }
  };

  // 失焦检测
  emailOnBlur = (e) => {
    let value = e.target.value;
    if(value){
      if(Validator.isEmail(value)){
        this.props.callback(value);
      }else{
        this.props.callback(value, '请输入正确的邮箱');
      }
    }else{
      this.props.callback(value, '请输入邮箱');
    }
  };

  render(){

    const { value } = this.state;
    const { autoFocus } = this.props;

    return(
      <Input
        size="large"
        maxLength={30}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="邮箱"
        onChange={this.changeValue}
        onBlur={this.emailOnBlur}
        value={value}
        allowClear={true}
      />
    )
  }

}
