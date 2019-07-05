## 手机输入框 InputMobile

#### jsx
```
/**
 * 表单 - 手机号
 */
import React from 'react';
import { Input, Icon } from 'antd';

export default class InputMobile extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: this.props.default || '',            //输入框的值
    }
  }

  // 是否是手机号
  isPhone = (tel) => {
    let reg = /^1[0-9]{10}$/;
    return reg.test(tel);
  };

  // 是否是1开头的手机格式
  checkPhone = (value) => {
    if (value.substr(0, 1) === '1') {
      return value.length <= 11;
    } else {
      return false;
    }
  };

  // 监控手机号输入
  changeValue = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g,'');
    this.setState({ value });
    if(this.checkPhone(value)){
      this.props.callback(value);
    }else{
      this.props.callback(value, '请输入正确的手机号');
    }
  };

  // 手机失焦检测
  mobileOnBlur = (e) => {
    let value = e.target.value;
    if(value){
      if(this.isPhone(value)){
        this.props.callback(value);
      }else{
        this.props.callback(value, '请输入正确的手机号');
      }
    }else{
      this.props.callback(value, '请输入手机号');
    }
  };

  //清空输入框
  emitEmpty(){
    this.setState({ value: '' });
    this.props.callback();
  };

  render(){

    const { value } = this.state;

    return(
      <Input
        size="large"
        maxLength="11"
        autoComplete="off"
        placeholder="手机号"
        onChange={this.changeValue}
        onBlur={this.mobileOnBlur}
        value={value}
        suffix={
          value ?
            <Icon
              type="close-circle"
              onClick={() => this.emitEmpty()}
            />
            :
            null
        }
      />
    )
  }

}

```
