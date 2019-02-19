/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Row, Col, Input, Icon } from 'antd';

export default class InputText extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
    }
  }

  changeValue = (e) => {
    let value = e.target.value;
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
        size="large"
        maxLength="11"
        autoComplete="off"
        placeholder={this.props.placeholder}
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
