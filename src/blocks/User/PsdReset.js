/**
 * 重置密码 - 登录密码 或 交易密码
 * psdType [String] 密码类型
 * step [String]   Steps组件初始化
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Redirect } from 'dva/router';
import { Row, Col, Form, Button, Steps } from 'antd'
import { Toast } from 'antd-mobile'
import { hasErrors } from '@/utils/utils'
import { Encrypt } from '@/utils'
import styles from './PsdReset.less';

import InputMobile from '@/components/Form/InputMobile'
import InputPassword from '@/components/Form/InputPassword'
import InputSmscode from '@/components/Form/InputSmscode'

const FormItem = Form.Item;
const Step = Steps.Step;

const steps = [
  {
    title: '填写用户信息',
    key: 'index',
    content: 'First-content',
  },
  {
    title: '验证用户信息',
    key: 'smscode',
    content: 'Second-content',
  },
  {
    title: '重置密码',
    key: 'password',
    content: 'Thrid-content',
  },
  {
    title: '完成',
    key: 'finish',
    content: 'Last-content',
  }
];

@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class PsdReset extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.loading = false;
    this.state = {
      current: 0,
      mobile: '',
      smscodeSended: false,
      autoSubmitTimer: 5,
    }
  }

  componentDidMount(){
    let step = this.props.step;
    this.initStep(step);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.step !== this.props.step) {
      let step = nextProps.step;
      this.initStep(step);
    }
  }

  // 清空输入框
  emitEmpty(key){
    this.props.form.resetFields([key]);
    if(key === 'mobile') this.setState({mobile: ''});
  };

  //初始化步骤条
  initStep = (step) => {
    for(let i in steps){
      if(steps[i].key === step) this.setState({current: parseInt(i, 10)})
    }
  };

  // 手机号
  mobileCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'mobile': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'mobile': value});
    }
  };

  //短信验证码回调
  smscodeCallback = (value, err) => {
    if(err === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
      this.setState({smscodeSended: true});
    }
    else if(err === 'smscodeError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: [new Error(!value ? '请输入短信验证码' : '短信验证码格式有误')]
        }
      });
    }
    else{
      this.props.form.setFieldsValue({'smscode': value});
    }
  };

  // 密码
  passwordCallback = (value, err) => {
    // console.log(value)
    if(err){
      this.props.form.setFields({
        'password': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'password': value});
      this.props.form.setFields({
        password: {value: value, errors: ''},
        rpassword: {value: this.props.form.getFieldValue('rpassword'), errors: ''},
      });
    }
  };

  // 确认密码
  rpasswordCallback = (value, err) => {
    // console.log(value)
    if(err){
      this.props.form.setFields({
        'rpassword': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'rpassword': value});
      this.props.form.setFields({
        password: {value: this.props.form.getFieldValue('password'), errors: ''},
        rpassword: {value: value, errors: ''},
      });
    }
  };

  // 比对密码
  checkConfirm = (rule, value, callback) => {
    let password = this.props.form.getFieldValue('password'),
      rpassword = this.props.form.getFieldValue('rpassword');
    if(password && rpassword && password !== rpassword){
      callback('两次输入的密码不一致')
    }else{
      this.props.form.setFields({
        password: {value: password, errors: ''},
        rpassword: {value: rpassword, errors: ''},
      });
      callback()
    }
  };

  // step 1 - 检验手机号
  next1 = () => {

    this.props.form.validateFields(['mobile'], (err, values) => {
      if(!err){
        this.props.dispatch({
          type: 'global/post',
          url: 'api/v1/user/checkPhone',
          payload: {
            mobile: values.mobile
          },
          callback: (res) => {
            if(res.status === 1) {
              this.setState({
                mobile: values.mobile
              });
              this.props.dispatch(routerRedux.push('/user/reset/smscode'));
            }else{
              this.props.form.setFields({
                'mobile': {
                  value: values.mobile,
                  errors: [new Error(res.msg)]
                }
              });
            }
          }
        });
      }
    });

  };

  // step 2 - 检验短信验证码
  next2 = () => {

    this.props.form.validateFields(['smscode'], (err, values) => {
      if(!err){
        this.setState({
          smscode: values.smscode
        });
        this.props.dispatch(routerRedux.push('/user/reset/password'));
      }
    });

  };

  // step 3 - 修改密码
  changePsdSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.loading = true;
    let { mobile, smscode } = this.state;

    this.props.form.validateFields(['password', 'rpassword'], (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'global/post',
          url: 'api/resetPsd',
          payload:{
            mobile,
            smscode,
            password: Encrypt(mobile, values.password)
          },
          callback: (res) => {
            setTimeout(() => {
              this.loading = false;
              this.ajaxFlag = true;
            }, 500);
            if(res.status === 1){
              this.props.dispatch(routerRedux.push('/user/reset/finish'));
            }else{
              Toast.info(res.msg, 2);
            }
          }
        })
      }else{
        setTimeout(() => {
          this.loading = false;
          this.ajaxFlag = true;
        }, 500);
      }
    });
  };

  // step 4 - 页面自动跳转
  autoSubmit = () => {
    let {autoSubmitTimer} = this.state;
    let timer = setInterval(() => {
      if(autoSubmitTimer === 1){
        clearInterval(timer);
        this.toLogin();
      }else{
        autoSubmitTimer--;
        this.setState({autoSubmitTimer})
      }
    }, 1000)
  };

  // 去登录
  toLogin = () => {
    this.props.dispatch(routerRedux.push('/user/login'));
  };

  render(){

    const { current, mobile, autoSubmitTimer, smscodeSended } = this.state;

    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    steps[0].content = (
      <div className={styles.step1}>
        <div className={styles.formItemBox}>
          <FormItem>
            {getFieldDecorator('mobile', {
              initialValue: mobile,
              validateFirst: true,
              rules: [
                { required: true, message: '请输入手机号码' },
              ],
            })(
              <InputMobile default={mobile} callback={this.mobileCallback}/>
            )}
          </FormItem>
        </div>
      </div>
    );

    steps[1].content = (
      <div className={styles.step2}>
        <div className={styles.formItemBox}>
          <FormItem>
            {getFieldDecorator('smscode', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入短信验证码' },
              ],
            })(
              <InputSmscode
                // auto={true}
                mobile={hasErrors(getFieldsError(['mobile'])) ? '' : getFieldValue('mobile')}
                callback={this.smscodeCallback}
              />
            )}
          </FormItem>
        </div>
      </div>
    );

    steps[2].content = (
      <div className={styles.step3}>
        <div className={styles.formItemBox}>
          <FormItem>
            {getFieldDecorator('password', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入新密码' },
                { validator: this.checkConfirm },
              ],
            })(
              <InputPassword callback={this.passwordCallback}/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('rpassword', {
              rules: [
                { required: true, message: '请再次输入新密码' },
                { validator: this.checkConfirm }
              ],
            })(
              <InputPassword callback={this.rpasswordCallback}/>
            )}
          </FormItem>
        </div>
      </div>
    );

    steps[3].content = (
      <div className={styles.step4}>
        <div className={styles.desc}>
          <p className={styles.p1}>恭喜您成功找回密码！您需要重新登录系统。</p>
          <p className={styles.p2}><span>{autoSubmitTimer}</span>s后将自动跳转到登录页面</p>
        </div>
      </div>
    );

    return(

      <div className={styles.psdReset}>

        <h1>找回密码</h1>

        {
          current > 0 && !mobile ?
            <Redirect to="/user/reset/index" />
            :
            <Form className={styles.form}>

              <div className={styles.title}>
                <Steps current={current} labelPlacement="vertical">
                  {steps.map(item => <Step key={item.key} title={item.title} />)}
                </Steps>
              </div>

              <Row>
                <Col sm={1} xs={1} md={6} lg={6}/>
                <Col sm={22} xs={22} md={12} lg={12}>
                  <div className={styles.formContent}>

                    <div className={styles.stepsContent}>
                      {steps[current].content}
                    </div>

                    <FormItem>

                      {
                        current === 0 ?
                          <Button
                            size="large"
                            type="primary"
                            className={styles.btn}
                            onClick={this.next1}
                            disabled={hasErrors(getFieldsError(['mobile'])) || !getFieldValue('mobile')}
                          >
                            下一步
                          </Button>
                          :
                          null
                      }

                      {
                        current === 1 ?
                          <Button
                            size="large"
                            type="primary"
                            className={styles.btn}
                            onClick={this.next2}
                            disabled={
                              hasErrors(getFieldsError(['smscode'])) ||
                              !getFieldValue('smscode') ||
                              !smscodeSended
                            }
                          >
                            下一步
                          </Button>
                          :
                          null
                      }

                      {
                        current === 2 ?
                          <Button
                            size="large"
                            // loading={this.loading}
                            type="primary"
                            className={styles.btn}
                            onClick={this.changePsdSubmit}
                            disabled={
                              hasErrors(getFieldsError(['password', 'rpassword'])) ||
                              !getFieldValue('password') ||
                              !getFieldValue('rpassword')
                            }
                          >
                            下一步
                          </Button>
                          :
                          null
                      }

                      {
                        current === 3 ?
                          <Button
                            size="large"
                            type="primary"
                            className={styles.btn}
                            onClick={this.toLogin}
                          >
                            立即登录
                            {this.autoSubmit()}
                          </Button>
                          :
                          null
                      }

                    </FormItem>
                  </div>
                </Col>
                <Col sm={1} xs={1} md={6} lg={6}/>
              </Row>

            </Form>
        }

      </div>

    )
  }

}
