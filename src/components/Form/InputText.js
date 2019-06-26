/**
 * 单行文本输入框
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

  //清空输入框
  emitEmpty(){
    this.setState({ value: '' });
    this.props.callback();
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
