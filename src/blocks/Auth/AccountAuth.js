/**
 * 身份校验 - 发送短信验证码
 */
import React from 'react'
import {connect} from 'dva'
import {Modal, Button, Row, Col, Input} from 'antd'
import {Toast} from 'antd-mobile'
import {ENV, Storage, Validator} from '@/utils'
import styles from './AccountAuth.less'

let timer

@connect(state => ({
  global: state.global,
}))
export default class AccountAuth extends React.Component {

  constructor(props) {
    super(props)
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      visible: false,
      maxLength: 6,
      value: '',
      btnText: '获取验证码',
      btnStyle: styles.actived,
      num: 60,                     //倒计时
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  check = () => {
    if (Storage.get(ENV.storage.accountAuth, 3600*24)) {
      return true
    } else {
      this.show()
      return false
    }
  }

  show = () => {
    this.setState({
      visible: true
    })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  //改变输入值
  changeValue = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    this.setState({value});
  };

  //确定
  submit = () => {

    if (this.state.btnStyle !== styles.actived) return;

    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.sendSmsCode();

    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //发送验证码
  sendSmsCode = () => {
    this.props.dispatch({
      type: 'global/request',
      url: '/user/smscode',
      method: 'POST',
      payload: {
        type: "auth"
      },
      callback: (res) => {
        if (res.code === 0) {
          const {currentUser} = this.props.global
          this.interval()                                      //执行倒计时
          Toast.info(`已将短信验证码发送到您${currentUser.mobile}的手机当中，请注意查收！`, 2)
        } else {
          Toast.info(res.message, 2)
        }
      }
    })
  }

  //短信倒计时
  interval() {
    let num = 60
    this.setState({ btnText: '重新发送(' + num + 's)', btnStyle: styles.disabled })
    timer = setInterval(() => {
      if (num === 1) {
        this.ajaxFlag = true
        this.setState({
          btnText: '重新获取',
          btnStyle: styles.actived,
          num: 60
        })
        clearInterval(timer)
      } else {
        num--
        this.setState({btnText: '重新发送(' + num + 's)', num: num})
      }
    }, 1000)
  }

  // 验证
  onOk = () => {
    this.props.dispatch({
      type: 'global/request',
      url: '/user/accountAuth',
      method: 'POST',
      payload: {
        smscode: this.state.value
      },
      callback: (res) => {
        if (res.code === 0) {
          Storage.set(ENV.storage.accountAuth, true);
          this.hide();
        } else {
          Toast.info(res.message, 2)
        }
      }
    })
  }

  onCancel = () => {
    this.hide()
  }

  render() {

    const {visible, maxLength, value, btnText, btnStyle} = this.state
    const {currentUser} = this.props.global

    return (
      <Modal
        width={400}
        visible={visible}
        centered={true}
        footer={null}
        wrapClassName={styles.accountAuth}
        onCancel={this.onCancel}
      >
        <div className={styles.container}>
          <div className={styles.head}>
            <h2>身份验证</h2>
            <p>为了保护你的帐号安全，请验证身份，<br/> 验证成功后进行下一步操作</p>
          </div>

          <div className={styles.body}>
            <p>使用手机 {currentUser.mobile} 验证</p>

            <Row gutter={10} className={styles.smscode}>
              <Col xs={14} sm={14} md={16} lg={16}>
                <Input
                  size="large"
                  maxLength={maxLength}
                  autoComplete="off"
                  placeholder="短信验证码"
                  onChange={this.changeValue}
                  value={value}
                  allowClear={true}
                />
              </Col>
              <Col xs={10} sm={10} md={8} lg={8}>
                <span
                  className={styles.btn + " " + btnStyle}
                  onClick={this.submit}
                >
                  {btnText}
                </span>
              </Col>

            </Row>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={styles.submit}
              disabled={
                !value ||
                value.length < maxLength
              }
              onClick={this.onOk}
            >
              验证
            </Button>

          </div>
        </div>
      </Modal>
    )
  }

}
