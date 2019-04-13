import React from 'react'
import { connect } from 'dva';
import { Link } from 'dva/router'
import { Form, Button } from 'antd'
import { Modal, Toast } from 'antd-mobile';
import { ENV, Storage, hasErrors, getUrlParams, setupWebViewJavascriptBridge } from "~/utils/utils";
import styles from './Lucky.less'

import InputMobile from '~/components/Form/InputMobile'
import InputSmscode from '~/components/Form/InputSmscode'

const FormItem = Form.Item;
const paramsObj = getUrlParams() || '';

@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class Lucky extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      luckyCount: Storage.get(ENV.storageLucky) || 0,     //抽奖次数
      modalVisible: false,
    }
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto'
  }

  //手机号
  mobileCallback = (value, err) => {
    if(err){
      this.props.form.setFields({
        'tel': {
          value: value,
          errors: [new Error(err)]
        }
      });
    }else{
      this.props.form.setFieldsValue({'tel': value});
      this.props.form.validateFields(['tel'], (err, values) => {});
    }
  };

  //短信验证码回调
  smscodeCallback = (value) => {
    //清空错误提示
    if(value === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
      this.setState({smscodeSended: true});
    }
    else if(value === 'telError'){
      this.props.form.setFields({
        'tel': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
      this.setState({smscodeSended: true});
    }
    else{
      this.props.form.setFieldsValue({'smscode': value});
      this.props.form.validateFields(['smscode'], (err, values) => {});
    }
  };

  //表单确认
  handleFormSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        this.submit(values);
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  submit = () => {
    this.props.dispatch({
      type: 'global/post',
      url: '',
      payload: {

      },
      callback: (res) => {
        if(res.code === '0'){

        }else{
          Toast.info(res.msg, 2);
        }
      }
    })
  };

  modalShow = () => {
    this.setState({
      modalVisible: true
    });
  };

  modalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  // 分享交互
  share = () => {
    let action = 'share_lucky';
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //判断是否是 android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //判断是否是 ios终端

    if (isiOS) {
      setupWebViewJavascriptBridge( (bridge) => {
        bridge.callHandler('h5Action', action, (response) => {
        });
      });
    }
    else if(isAndroid){
      window.app.h5Action(action);      //与原生交互
    }else{
      return ''
    }
  };

  render() {

    const { luckyCount, modalVisible } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    const modalWidth = document.body.clientWidth < 750 ? '95%' : '360px';

    return (
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={require('~/assets/hdzq/lucky/logo.png')} alt="logo"/>
          </Link>
        </div>

        <div className={styles.content}>
          <img className={styles.bg} src={require('~/assets/hdzq/lucky/lucky_bg.jpg')} alt="bg"/>

          {
            paramsObj.platform === 'app' ?
              null
              :
              <div>
                {
                  luckyCount ?
                    <div className={styles.download}>
                      <dl>
                        <dt>恭喜您已获得</dt>
                        <dd>
                          <p className={styles.p1}>特等奖</p>
                          <p className={styles.p2}>已放入180****3234 趣族账户</p>
                        </dd>
                      </dl>
                      <p>
                        <Link to="/download">下载APP立即使用</Link>
                      </p>
                      {/*<p>*/}
                      {/*<a onClick={this.modalShow}>显示modal</a>*/}
                      {/*</p>*/}
                    </div>
                    :
                    <div className={styles.form}>

                      <Form onSubmit={this.handleFormSubmit}>

                        <FormItem>
                          {getFieldDecorator('tel', {
                            validateTrigger: 'onBlur',
                            rules: [
                              { required: true, message: '请输入手机号' },
                              { pattern: /^1[0-9]{10}$/, message: '手机号输入有误' }
                            ],
                          })(
                            <InputMobile callback={this.mobileCallback}/>
                          )}
                        </FormItem>

                        <FormItem>
                          {getFieldDecorator('smscode', {
                            validateTrigger: 'onBlur',
                            rules: [
                              { required: true, message: '请输入验证码' },
                              { pattern: /^[0-9]{4}$/, message: '短信验证码错误' },
                            ]
                          })(
                            <InputSmscode
                              api={'/api/user/get_code'}
                              isrepeat={'5'}
                              tel={hasErrors(getFieldsError(['tel'])) ? '' : getFieldValue('tel')}
                              callback={this.smscodeCallback}
                              buttonStyle={{height: '40px', lineHeight: '40px', background: '#fff', color: '#333'}}
                            />
                          )}
                        </FormItem>

                        <Button
                          size="large"
                          type="primary"
                          htmlType="submit"
                          className={styles.btn}
                          disabled={
                            hasErrors(getFieldsError()) ||
                            !getFieldValue('tel') ||
                            !getFieldValue('smscode')
                          }
                        >
                          立即抽奖
                        </Button>

                      </Form>

                    </div>
                }
              </div>
          }

          <div className={styles.desc}>
            <dl>
              <dt><i/><strong>活动细则</strong></dt>
              <dd>
                <p>1、活动简介：扫描二维码，在活动页面输入手机号+验证码即可参与抽奖活动，奖品含模型、手办等</p>

                <p>2、领取方式：奖品至APP内领取，填写手机号与活动页面所输入的手机号一致即可领取奖品</p>

                <p>3、更多抽奖机会：</p>

                <p>3.1 下载APP登录后，即可再获得一次抽奖机会；</p>

                <p>3.2 将抽奖页面分享给5个微信好友，即可多一次抽奖机会，距离手办大礼更近一步</p>

                <p>4、填写信息后可领取奖品，特等奖、一等奖、二等奖可联系工作人员邮寄发放，其他奖品须在现场领取</p>

                <p>5、领奖日期为4月19日-4月30日，逾期领奖资格作废</p>
              </dd>
            </dl>
          </div>

        </div>

        <Modal
          style={{width: modalWidth}}
          title="恭喜您已获得"
          footer={false}
          closable={true}
          maskClosable={false}
          transparent={true}
          visible={modalVisible}
          onClose={this.modalCancel}
          className={styles.luckyModal}
        >
          <div className={styles.con}>
            <img src={require('~/assets/hdzq/lucky/modal_bg.png')} width="200" height="auto" alt="bg"/>
            <p className={styles.p1}>特等奖</p>
            <p className={styles.p2}>已放入180****3234 趣族账户</p>
            <p className={styles.hr}/>
            <p>
              <Button><Link to="/download">下载APP立即使用</Link></Button>
            </p>
            <p>
              <Button type="primary" onClick={this.share}>分享优惠给朋友</Button>
            </p>
          </div>
        </Modal>

      </div>
    )
  }

}
