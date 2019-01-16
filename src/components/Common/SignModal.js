import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Form, Input, Icon, Button, Checkbox, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import {ENV, Storage} from "~/utils/utils";
import styles from './SignModal.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const keys1 = ['tel', 'password', 'captcha', 'remember'];
const keys2 = ['r_tel', 'r_captcha', 'r_smscode', 'r_password'];
let timer;

@connect(state => ({
  global: state.global
}))
@Form.create()
export default class UserSign extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      userType: 'user',                               //用户类型
      loginType: 'psd',                               //登录方式
      registerType: 'psd',                            //注册方式

      remember: Storage.get(ENV.storageRemenber) !== null ? Storage.get(ENV.storageRemenber) : true,
      captcha: '',
      codeText: '获取验证码',
      errorCount: 0,                                  //表单输入错误次数
    }
  }

  //验证码
  getCaptcha = () => {
    this.setState({
      captcha: 'api/captcha.png?rnd=' + Math.random()
    })
  };

  //登录注册modal状态
  setUserModal(value, key){
    if(value) this.getCaptcha();
    if(key === '2' && !value) clearInterval(timer);
    this.props.form.resetFields();															                //重置所有表单
    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: value,
        signTabKey: key,
      }
    });
  }
  //tab切换
  changeTabKey(key){
    this.setUserModal(true, key)
  }

  //记住我
  rememberChange = () => {
    let rememberState = !this.state.remember;
    Storage.set(ENV.storageRemenber, rememberState);
    this.setState({remember: rememberState});
  };

  //短信倒计时
  interval(){
    let num = 30;
    this.setState({codeText: num + '秒'});
    timer = setInterval(() => {
      if(num === 1){
        this.setState({codeText: '获取验证码'});
        clearInterval(timer);
      }else{
        num--;
        this.setState({codeText: num + '秒'})
      }
    }, 1000);
  }

  //获取短信验证码
  getCode = (e) => {
    e.preventDefault();

    if(this.state.codeText !== '获取验证码') return;
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(['r_tel', 'r_captcha'], (err, values) => {

      if (!err){
        this.interval();                                      //执行倒计时
        this.props.dispatch({
          type: 'global/smsCode',
          payload: {
            tel: values.r_tel,
            userType: this.state.userType,
            captcha: parseInt(values.r_captcha, 10),
          },
          callback: (res) => {
            if (res.status !== 1) {
              clearInterval(timer);                           //返回错误时，清除倒计时
              this.setState({codeText: '获取验证码'});
              notification.error({
                message: '发送失败',
              });
            }
          }
        });
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //注册确定
  regeditSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(keys2, (err, values) => {
      if (!err) {
        //console.log(values)
        let data = {
          userType: this.state.userType,
          tel: values.r_tel,
          captcha: parseInt(values.r_captcha, 10),
          smscode: values.r_smscode,
          password: values.r_password,
        };
        this.props.dispatch({
          type: 'global/register',
          payload: data,
          callback: (res) => {
            if (res.status === 1) {
              this.setUserModal(false, '2');
            }else{
              this.getCaptcha();
              notification.error({
                message: '注册失败！',
                description: res.msg,
              });
            }
          }
        });
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });
  };

  //登录确定
  loginSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields(keys1, (err, values) => {
      if (!err) {
        if(values.remember){
          Storage.set(ENV.storageLastTel, values.tel)
        }else{
          Storage.set(ENV.storageLastTel, '')
        }
        this.props.dispatch({
          type: 'global/login',
          payload: {
            ...values,
            userType: this.state.userType,
            loginType: this.state.loginType,
            captcha: parseInt(values.captcha, 10)
          },
          callback: (res) => {
            if(res.status === 1) {
              this.setUserModal(false, '1');
            }else{
              this.getCaptcha();
              notification.error({
                message: '登录失败！',
                description: res.msg,
              });
            }
          }
        });
      }
      setTimeout(() => { this.ajaxFlag = true }, 500);
    });
  };

  //退出登录
  logout = () => {
    let _this = this;
    confirm({
      title: '退出登录?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        _this.props.dispatch({
          type: 'global/logout',
        });
      },
      onCancel() {},
    });
  };

  render() {

    const { codeText } = this.state;
    const { form, global } = this.props;
    const { getFieldDecorator } = form;
    const { isAuth, currentUser, lastTel, signModalVisible, signTabKey } = global;

    const userMenu = isAuth ?
      <Menu>
        <Menu.Item>
          <Link to={`/u/${currentUser.username}`}>我的主页</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/setting">设置</Link>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.logout}>退出</a>
        </Menu.Item>
      </Menu>
      : null;

    const publishMenu = isAuth ?
      <Menu>
        <Menu.Item>
          <Link to="/publish/photo">发布图片</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/publish/article">发布文章</Link>
        </Menu.Item>
      </Menu>
      : null;

    //判断是否登录
    const userShow = isAuth ?
      <div key="logout">
        <Dropdown overlay={userMenu}>
          <Link className={styles.userInfo} to={`/u/${currentUser.username}`}>
            {
              currentUser.avatar ?
                <img src={currentUser.avatar + '?x-oss-process=style/thumb_s'} alt="用户头像" />
                :
                <Icon type="user" />
            }
            <span className={styles.username}>{currentUser.username}</span>
          </Link>
        </Dropdown>
        <Dropdown overlay={publishMenu}>
          <Link to="/publish/photo"><Button className={styles.userBtn} type="primary">发布</Button></Link>
        </Dropdown>
      </div>
      :
      <div key="login">
        <Button className={styles.userBtn + " " + styles.loginBtn} onClick={ () => this.setUserModal(true, '1') }>登录</Button>
        <Button className={styles.userBtn} type="primary" onClick={ () => this.setUserModal(true, '2') }>注册</Button>
      </div>;

    return(
      <div className={styles.userAction}>
        {userShow}

        {/*登陆注册Modal begin! */}
        <Modal title=""
          width="400px"
          wrapClassName="vertical-center-modal"
          visible={signModalVisible}
          onCancel={ () => this.setUserModal(false, "1") }
          footer={null}
          className={styles.userModal}
        >
          <Tabs type="card" activeKey={signTabKey} onChange={this.changeTabKey.bind(this)}>

            <TabPane tab="登录" key="1">
              <Form onSubmit={this.loginSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('tel', {
                    initialValue: lastTel,
                    rules: [
                      { required: true, message: '请输入手机号！' },
                      { pattern: /^1[0-9]{10}$/, message: '手机号输入有误！' }
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder="手机号"
                    />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '请输入密码！' },
                      { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字！' }
                    ],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder="密码"
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
                          size="large"
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
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: this.state.remember,
                  })(
                    <Checkbox onChange={this.rememberChange}>记住账号</Checkbox>
                  )}
                  <a className={styles.forgotPsd}>忘记密码</a><br/>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="form-button"
                  >
                    登录
                  </Button>
                </FormItem>
                <FormItem>
                  <Button
                    size="large"
                    type="default"
                    className="form-button"
                    onClick={ () => this.setUserModal(false, "1") }
                  >
                    取消
                  </Button>
                </FormItem>
              </Form>
            </TabPane>

            <TabPane tab="注册" key="2">
              <Form onSubmit={this.regeditSubmit} className="regedit-form">
                <FormItem>
                  {getFieldDecorator('r_tel', {
                    rules: [
                      { required: true, message: '请输入手机号！' },
                      { pattern: /^1[0-9]{10}$/, message: '手机号输入有误！' }
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder="手机号"
                    />
                  )}
                </FormItem>
                <FormItem>
                  <Row gutter={10}>
                    <Col span={16}>
                      {getFieldDecorator('r_captcha', {
                        rules: [
                          { required: true, message: '请输入验证码！' },
                          { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字！' }
                        ]
                      })(
                        <Input
                          size="large"
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
                      {getFieldDecorator('r_smscode', {
                        rules: [
                          { required: true, message: '请输入验证码！' },
                          { len: 6, message: '手机验证码格式有误！' },
                          { pattern: /^[0-9]+$/, message: '只能输入数字！' }
                        ]
                      })(
                        <Input
                          ref={c => this.inputCode = c}
                          size="large"
                          placeholder="手机验证码"
                        />
                      )}
                    </Col>
                    <Col span={8}>
                      <Button
                        size="large"
                        className={styles.codeBtn}
                        onClick={this.getCode}
                        disabled={codeText !== '获取验证码'}
                      >
                        {codeText}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  {getFieldDecorator('r_password', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '请输入密码！' },
                      { min: 6, message: '密码长度不能小于6位！' },
                      { max: 16, message: '密码长度不能大于16位！' },
                      { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母和数字！' }
                    ],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder="密码6-16位，区分大小写"
                    />
                  )}
                </FormItem>
                <FormItem>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="form-button"
                  >
                    注册
                  </Button>
                </FormItem>
                <FormItem>
                  <Button
                    size="large"
                    type="default"
                    className="form-button"
                    onClick={ () => this.setUserModal(false, "2") }
                  >
                    取消
                  </Button>
                </FormItem>
              </Form>
            </TabPane>
          </Tabs>

        </Modal>
        {/*登陆注册Modal end! */}

      </div>
    )

  }

}
