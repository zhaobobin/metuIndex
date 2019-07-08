/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Checkbox } from 'antd';
import { ArticleAlert } from '@/components/Dialog/Dialog'

export default class FormXieyi extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      title: '迷图网用户注册协议',
      checked: true,
    }
  }

  xieyiChecked = () => {
    let checked = !this.state.checked;
    this.setState({
      checked
    });
    this.props.callback(checked)
  };

  showXieyi = () => {
    ArticleAlert({
      title: this.state.title,
      msg: '<p>迷图网用户注册协议</p>',
      btns: ['确定'],
      callback: (res) => {}
    })
  };

  render(){

    const { title, checked } = this.state;

    return(
      <span>
        <Checkbox
          checked={checked}
          onChange={this.xieyiChecked}
        >
          已阅读并同意
        </Checkbox>
        <a onClick={this.showXieyi}>《{title}》</a>
      </span>
    )
  }

}
