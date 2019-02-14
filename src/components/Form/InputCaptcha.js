/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Row, Col, Input, Icon } from 'antd';

export default class InputCaptcha extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      captcha: 'api/captcha.png?rnd=' + Math.random(),
      value: '',            //输入框的值
    }
  }

  //验证码
  getCaptcha = () => {
    let captcha = 'api/captcha.png?rnd=' + Math.random();
    this.setState({ captcha });
  };

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

    const { captcha, value } = this.state;

    return(
      <Row gutter={10}>
        <Col span={16}>
          <Input
            size="large"
            maxLength="4"
            autoComplete="off"
            placeholder="验证码"
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
        </Col>
        <Col span={8}>
          <div >
            <img
              src={captcha}
              onClick={this.getCaptcha}
              className='captcha'
              width="auto"
              height="32px"
              alt="图形验证码"
              style={{
                display: 'block',
                margin: 'auto',
                width: 'auto',
                height: '100%',
                cursor: 'pointer',
              }}
            />
          </div>
        </Col>
      </Row>
    )
  }

}
