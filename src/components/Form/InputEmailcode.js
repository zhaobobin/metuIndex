/**
 * 表单 - 邮箱验证码
 * auto [String]    自动发送
 * email [String] 邮箱
 * callback [Function] 返回输入值

 调用方式：
 <InputSmscode
 email={hasErrors(getFieldsError(['email'])) ? '' : getFieldValue('email')}
 callback={this.smscodeCallback}
 />

 回调函数：
 smscodeCallback = (value, err) => {
    //清空错误提示
    if(err === 'telError'){
      this.props.form.setFields({
        'email': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
    }
    else if(err === 'clearError'){
      this.props.form.setFields({
        'emailcode': {
          value: '',
          errors: ''
        }
      });
    }
    else if(err === 'smscodeError'){
      this.props.form.setFields({
        'emailcode': {
          value: '',
          errors: [new Error(!value ? '请输入短信验证码' : '短信验证码格式有误')]
        }
      });
    }
    else{
      this.props.form.setFieldsValue({'emailcode': value});
      // this.props.form.validateFields(['emailcode'], (err, values) => {});
    }
  };

 *
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Input } from 'antd';
import { Modal, Toast } from 'antd-mobile';
import { filterTel } from '@/utils/utils';
import styles from './InputSmscode.less';

import PintuValidate from '@/components/Form/PintuValidate'

let timer;

@connect(state => ({
  global: state.global
}))
export default class InputEmailcode extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      maxLength: 6,
      email: '',
      btnText: '获取验证码',
      btnStyle: styles.null,
      num: 60,                     //倒计时

      pintuNo: new Date().getTime(),
      modalVisible: false,    //拼图
    }
  }

  componentDidMount() {
    this.initBtnStyle(this.props.email);
    if(this.props.auto) this.sendEmailCode();      //自动发送验证码
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //按钮在激活状态，才重置倒计时
    if (nextProps.email !== this.props.email) {
      this.initBtnStyle(nextProps.email);
    }
  }

  componentWillUnmount(){
    clearInterval(timer);
  }

  //初始化按钮样式
  initBtnStyle(email) {
    let {num} = this.state;
    let btnStyle = email ?
      num === 60 ?
        styles.actived
        :
        this.state.btnStyle
      :
      num === 60 ?
        styles.null
        :
        styles.disabled;
    this.setState({
      email,
      btnStyle,
    })
  }

  //改变输入值
  changeValue = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    this.setState({value});
    this.props.callback(value);
  };

  handleBlur = (e) => {
    let value = e.target.value;
    if (value.length !== this.state.maxLength) {
      this.props.callback(value, 'emailcodeError');
    }
  };

  //确定
  submit = () => {

    let { email } = this.props;

    if (!email) {
      this.props.callback(email, 'emailError');
      return;
    }

    if (this.state.btnStyle !== styles.actived) return;

    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.setState({
      modalVisible: true
    });

    setTimeout(() => {
      this.ajaxFlag = true
    }, 500);
  };

  //拼图回调
  pintuResult = (value) => {
    if (!value) return;
    this.sendEmailCode();
    this.setState({
      modalVisible: false
    });
  };

  //发送邮箱验证码
  sendEmailCode = () => {
    let { type, email } = this.props;
    this.props.dispatch({
      type: 'global/request',
      url: '/user/emailcode',
      method: 'POST',
      payload: {
        type,
        email,
      },
      callback: (res) => {
        if (res.code === 0) {
          this.interval();                                      //执行倒计时
          this.props.callback('', 'clearError');
          Toast.info(`已将验证码发送到您${email}的邮箱当中，请注意查收！`, 2);
        } else {
          Toast.info(res.message, 2);
        }
      }
    });
  };

  //短信倒计时
  interval() {
    let num = 60;
    this.setState({btnText: '重新发送(' + num + 's)', btnStyle: styles.disabled, modalVisible: false});
    timer = setInterval(() => {
      if (num === 1) {
        this.ajaxFlag = true;
        this.setState({
          btnText: '重新获取',
          btnStyle: this.state.email ? styles.actived : styles.null,
          num: 60
        });
        clearInterval(timer);
      } else {
        num--;
        this.setState({btnText: '重新发送(' + num + 's)', num: num});
      }
    }, 1000)
  }

  modalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  render() {

    const {maxLength, value, btnText, btnStyle, pintuNo, modalVisible} = this.state;

    const buttonStyle = this.props.buttonStyle || {height: '40px', lineHeight: '40px'};

    const modalWidth = document.body.clientWidth < 750 ? '95%' : '360px';

    return (
      <div>
        <Row gutter={10} className={styles.smscode}>
          <Col xs={14} sm={14} md={16} lg={16}>
            <Input
              size="large"
              maxLength={maxLength}
              autoComplete="off"
              placeholder="邮箱验证码"
              onChange={this.changeValue}
              onBlur={this.handleBlur}
              value={value}
              allowClear={true}
            />
          </Col>
          <Col xs={10} sm={10} md={8} lg={8}>
          <span
            className={styles.btn + " " + btnStyle}
            style={buttonStyle}
            onClick={this.submit}
          >
            {btnText}
          </span>
          </Col>

        </Row>

        <Modal
          style={{width: modalWidth}}
          title="请先完成下方验证"
          footer={false}
          closable={true}
          maskClosable={false}
          transparent={true}
          visible={modalVisible}
          zIndex={1001}
          onClose={this.modalCancel}
          className={styles.pintuModal}
        >
          <PintuValidate no={pintuNo} callback={this.pintuResult}/>
        </Modal>
      </div>
    )
  }

}
