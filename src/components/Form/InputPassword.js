/**
 * 表单 - 密码
 */
import React from 'react';
import { Input } from 'antd';
import { Validator } from '@/utils';
import styles from './InputPassword.less';

export default class InputPassword extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
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

  checkPsd = (value) => {
    let psdLevel, psdLevelStyle;
    if(value) {
      let psdModes = Validator.checkPsdLevel(value);
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

  render(){

    const { placeholder, hidePsdLevel } = this.props;
    const { value, psdLevel, psdLevelStyle, minLength, maxLength } = this.state;

    const psdLevelVisible = hidePsdLevel ? false : this.state.psdLevelVisible

    return(
      <div className={styles.container}>
        <Input.Password
          size="large"
          autoComplete="off"
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder || '密码'}
          onChange={this.changeValue}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={value}
          allowClear={true}
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
