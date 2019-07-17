/**
 * 表单 - 单行文本输入框
 */
import React from 'react';
import { Input } from 'antd';

export default class InputText extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
    }
  }

  componentDidMount(){
    this.setState({
      value: this.props.defaultVaule
    })
  }

  changeValue = (e) => {
    let value = e.target.value;
    this.setState({ value });
    this.props.callback(value);
  };

  render(){

    const { value } = this.state;
    const { maxLength } = this.props;

    return(
      <Input
        size="large"
        autoComplete="off"
        placeholder={this.props.placeholder}
        onChange={this.changeValue}
        value={value}
        maxLength={maxLength}
        disabled={this.props.disabled}
        allowClear={true}
      />
    )
  }

}
