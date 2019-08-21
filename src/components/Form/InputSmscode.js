/**
 * 表单 - 短信验证码
 * auto [String]    自动发送
 * tel [Number] 手机号
 * callback [Function] 返回输入值

 调用方式：
   <InputSmscode
     tel={hasErrors(getFieldsError(['mobile'])) ? '' : getFieldValue('mobile')}
     callback={this.smscodeCallback}
   />

 回调函数：
 smscodeCallback = (value, err) => {
    //清空错误提示
    if(err === 'telError'){
      this.props.form.setFields({
        'mobile': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
    }
    else if(err === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
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
      // this.props.form.validateFields(['smscode'], (err, values) => {});
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
export default class InputSmscode extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      maxLength: 6,
      mobile: '',
      btnText: '获取验证码',
      btnStyle: styles.null,
      num: 60,                     //倒计时

      pintuNo: new Date().getTime(),
      modalVisible: false,    //拼图
    }
  }

  componentDidMount() {
    this.initBtnStyle(this.props.mobile);
    if(this.props.auto) this.sendSmsCode();      //自动发送验证码
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //按钮在激活状态，才重置倒计时
    if (nextProps.mobile !== this.props.mobile) {
      this.initBtnStyle(nextProps.mobile);
    }
  }

  componentWillUnmount(){
    clearInterval(timer);
  }

  //初始化按钮样式
  initBtnStyle(mobile) {
    let {num} = this.state;
    let btnStyle = mobile ?
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
      mobile,
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
      this.props.callback(value, 'smscodeError');
    }
  };

  //确定
  submit = () => {

    let {mobile} = this.props;

    if (!mobile) {
      this.props.callback(mobile, 'mobileError');
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
    this.sendSmsCode();
  };

  //发送验证码
  sendSmsCode = () => {
    let {mobile} = this.props;
    this.props.dispatch({
      type: 'global/post',
      url: 'api/smsCode',
      payload: {
        mobile,
        userType: 'user'
      },
      callback: (res) => {
        if (res.status === 1) {
          this.interval();                                      //执行倒计时
          this.props.callback('', 'clearError');
          Toast.info(`已将短信验证码发送到您${filterTel(mobile)}的手机当中，请注意查收！`, 2);
        } else {
          Toast.info(res.msg, 2);
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
          btnStyle: this.state.mobile ? styles.actived : styles.null,
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
              placeholder="短信验证码"
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
