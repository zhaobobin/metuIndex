/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Row, Col, Input, Icon } from 'antd';

export default class InputPassword extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
    }
  }

  changeValue = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g,'');
    this.setState({ value });
    this.props.callback(value);
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
        type="password"
        size="large"
        minLength="6"
        maxLength="20"
        autoComplete="off"
        placeholder="密码"
        onChange={this.changeValue}
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
