/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Row, Col, Input, Icon } from 'antd';
import styles from './InputPassword.less'

import eye_open from '~/assets/sign/signremind_open@2x.png'
import eye_close from '~/assets/sign/invisible@2x.png'

export default class InputPassword extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      inputType: 'password',
      psdLevelVisible: false,
      psdLevel: '',
      psdLevelStyle: '',

      minLength: 6,
      maxLength: 20,
    }
  }

  //监控输入值
  changeValue = (e) => {
    let value = e.target.value.replace(/ /g,'');
    this.checkPsd(value);
    this.props.callback(value);
  };

  // 焦点
  onFocus = () => {
    this.changePsdLevelVisible();
  };

  // 失焦
  onBlur = (e) => {

    let value = e.target.value.replace(/ /g,'');
    let { minLength, maxLength } = this.state;
    let { showPsdLevel } = this.props;

    if(value){
      if(value.length < minLength){
        this.props.callback(value, `密码长度不能小于${minLength}位`);
      }
      if(value.length > maxLength){
        this.props.callback(value, `密码长度不能大于${maxLength}位`);
      }
    }else{
      this.props.callback(value, '请输入密码');
    }

    if(showPsdLevel){
      this.changePsdLevelVisible();
    }

  };

  //切换密码框显示
  changePsdLevelVisible = () => {
    let psdLevelVisible = !this.state.psdLevelVisible;
    this.setState({
      psdLevelVisible
    })
  };

  //检查密码强度
  checkPsdLevel = (value) => {
    // 0： 表示第一个级别， 1：表示第二个级别， 2：表示第三个级别， 3： 表示第四个级别， 4：表示第五个级别
    let modes = 0;
    if (value.length < 8) {//最初级别
      return modes;
    }
    if (/\d/.test(value)) {//如果用户输入的密码 包含了数字
      modes++;
    }
    if (/[a-z]/.test(value)) {//如果用户输入的密码 包含了小写的a到z
      modes++;
    }
    if (/\W/.test(value)) {//如果是非数字 字母 下划线
      modes++;
    }
    if (/[A-Z]/.test(value)) {//如果用户输入的密码 包含了大写的A到Z
      modes++;
    }
    return modes;
  };

  checkPsd = (value) => {
    let psdLevel, psdLevelStyle;

    if(value) {
      let psdModes = this.checkPsdLevel(value);
      switch(psdModes){
        case 1 :
          psdLevel = '';
          psdLevelStyle = '';
          break;
        case 2 :
          psdLevel = '弱';
          psdLevelStyle = styles.psdLevelError;
          break;
        case 3 :
          psdLevel = '中';
          psdLevelStyle = styles.psdLevelMiddle;
          break;
        case 4 :
          psdLevel = '强';
          psdLevelStyle = styles.psdLevelStrong;
          break;
        default:
          psdLevel = '';
          psdLevelStyle = '';
          break;
      }
    }
    this.setState({
      value,
      psdLevel,
      psdLevelStyle
    });
  };

  //清空输入框
  emitEmpty(){
    this.setState({ value: '' });
    this.props.callback();
  };

  changeInputType = () => {
    let {inputType} = this.state;
    this.setState({
      inputType: inputType === 'text' ? 'password' : 'text'
    })
  };

  render(){

    const { placeholder, hidePsdLevel } = this.props;
    const { value, inputType, psdLevel, psdLevelStyle, minLength, maxLength } = this.state;

    const psdLevelVisible = hidePsdLevel ? false : this.state.psdLevelVisible

    return(
      <div className={styles.container + " " + styles.inputPassword}>
        <Input
          className={styles.password}
          type={inputType}
          size="large"
          autoComplete="off"
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder || '密码'}
          onChange={this.changeValue}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={value}
          suffix={
            <span>
              {
                value ?
                  <Icon
                    type="close-circle"
                    onClick={() => this.emitEmpty()}
                  />
                  :
                  null
              }
              <i className={styles.eye}>
                <img
                  src={inputType === 'text' ? eye_open : eye_close}
                  className={inputType === 'text' ? styles.open : styles.close}
                  onClick={this.changeInputType}
                  width="20px"
                  height="auto"
                  alt="eye"
                />
              </i>
            </span>
          }
        />
        {
          psdLevelVisible && value ?
            <div className={styles.psdStatus + " " + psdLevelStyle}>
              <p className={styles.box}>
                <span className={styles.line}><em className={styles.block}/></span>
                <span className={styles.line}><em className={styles.block}/></span>
                <span className={styles.line}><em className={styles.block}/></span>
                <span className={styles.text}>{psdLevel}</span>
              </p>
            </div>
            :
            null
        }
      </div>
    )
  }

}
