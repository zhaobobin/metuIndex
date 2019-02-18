/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Row, Col, Input, Icon } from 'antd';
import styles from './InputPassword.less'

export default class InputPassword extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      psdLevelVisible: false,
      psdLevel: '',
      psdLevelStyle: '',
    }
  }

  //监控输入值
  changeValue = (e) => {
    let value = e.target.value.replace(/ /g,'');
    this.checkPsd(value);
    this.props.callback(value);
  };

  //切换密码框显示
  changePsdLevelVisible = (value) => {
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

  render(){

    const { value, psdLevelVisible, psdLevel, psdLevelStyle } = this.state;

    return(
      <Input
        type="password"
        size="large"
        minLength="6"
        maxLength="20"
        autoComplete="off"
        placeholder="密码"
        onChange={this.changeValue}
        onFocus={this.changePsdLevelVisible}
        onBlur={this.changePsdLevelVisible}
        value={value}
        className={styles.password}
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
            {
              psdLevelVisible && value ?
                <div className={styles.psdStatus + " " + psdLevelStyle} style={this.props.psdLevelStyle}>
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
          </span>
        }
      />
    )
  }

}
