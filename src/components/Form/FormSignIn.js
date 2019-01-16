import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Input, Icon, Button, Checkbox, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import {ENV, Storage} from "~/utils/utils";
import styles from './FormSign.less'

const FormItem = Form.Item;

const keys = ['r_tel', 'r_captcha', 'smscode', 'r_password'];

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class UserSign extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loginType: 'psd',
      remember: Storage.get(ENV.storageRemenber) !== null ? Storage.get(ENV.storageRemenber) : true,
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

    const { form, global } = this.props;
    const { getFieldDecorator } = form;
    const { lastTel } = global;

    return(
      <Form
        onSubmit={this.handleFormSubmit}
        onReset={this.handleFormReset}
      >
        <FormItem>
          {getFieldDecorator('tel', {
            initialValue: lastTel,
            rules: [
              { required: true, message: '请输入手机号！' },
              { pattern: /^1[0-9]{10}$/, message: '手机号输入有误！' }
            ],
          })(
            <Input prefix={<Icon type="mobile" className={styles.prefixIcon} />} placeholder="手机号" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码！' },
              { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字！' }
            ],
          })(
            <Input prefix={<Icon type="lock" className={styles.prefixIcon} />} type="password" placeholder="密码" />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: this.state.remember,
          })(
            <Checkbox onChange={this.rememberChange}>记住账号</Checkbox>
          )}
          <a className={styles.forgotPsd}>忘记密码</a><br/>
          <Button type="primary" htmlType="submit" className="form-button">登录</Button>
        </FormItem>
        <FormItem>
          <Button type="default" className="form-button" onClick={ this.props.cancelCallback }>取消</Button>
        </FormItem>
      </Form>
    )
  }

}
