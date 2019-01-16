import React from 'react';
import { Link } from 'dva/router';
import { Row, Col, Form, Input, Icon, Button, Checkbox, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import {ENV, Storage} from "~/utils/utils";
import styles from './FormSign.less'

const FormItem = Form.Item;

const keys = ['tel', 'captcha', 'smscode', 'password'];

@Form.create()
export default class UserSign extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      userType: 'user',
      captcha: 'api/captcha.png?rnd=' + Math.random(),
    }
  }

  //验证码
  getCaptcha = () => {
    this.setState({
      captcha: 'api/captcha.png?rnd=' + Math.random()
    })
  };

  handleFormSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        this.props.callback(values);
      }
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  render(){

    const { getFieldDecorator } = this.props.form;

    return(
      <Form
        onSubmit={this.handleFormSubmit}
        onReset={this.handleFormReset}
      >
        <FormItem>
          {getFieldDecorator('tel', {
            rules: [
              { required: true, message: '请输入手机号！' },
              { pattern: /^1[0-9]{10}$/, message: '手机号输入有误！' }
            ],
          })(
            <Input
              prefix={<Icon type="mobile" className={styles.prefixIcon} />}
              placeholder="手机号"
            />
          )}
        </FormItem>
        <FormItem>
          <Row gutter={10}>
            <Col span={16}>
              {getFieldDecorator('captcha', {
                rules: [
                  { required: true, message: '请输入验证码！' },
                  { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字！' }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" className={styles.prefixIcon} />}
                  placeholder="验证码"
                />
              )}
            </Col>
            <Col span={8}>
              <div className={styles.captcha}>
                <img
                  src={this.state.captcha}
                  onClick={this.getCaptcha}
                  className='captcha'
                  width="auto"
                  height="32px"
                  alt="图形验证码"
                />
              </div>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row gutter={10}>
            <Col span={16}>
              {getFieldDecorator('smscode', {
                rules: [
                  { required: true, message: '请输入验证码！' },
                  { max: 4, message: '手机验证码格式有误！' },
                  { pattern: /^[0-9]+$/, message: '只能输入数字！' }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" className={styles.prefixIcon} />}
                  placeholder="手机验证码"
                />
              )}
            </Col>
            <Col span={8}>
              <Button className={styles.codeBtn}>获取验证码</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码长度不能小于6位！' },
              { max: 16, message: '密码长度不能大于16位！' },
              { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字！' }
            ],
          })(
            <Input
              type="password"
              prefix={<Icon type="lock" className={styles.prefixIcon} />}
              placeholder="密码6-16位，区分大小写"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="form-button">注册</Button>
        </FormItem>
        <FormItem>
          <Button type="default" className="form-button" onClick={ this.props.cancelCallback }>取消</Button>
        </FormItem>
      </Form>
    )
  }

}
