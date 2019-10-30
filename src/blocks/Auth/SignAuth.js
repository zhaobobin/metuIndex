/**
 * 登录校验 - 点击触发
 */
import React from 'react';
import { connect } from 'dva';

@connect(state => ({
  global: state.global,
}))
export default class SignAuth extends React.Component {

  constructor(props){
    super(props);
    this.flag = true;
  }

  componentDidMount(){
    this.props.onRef(this);
  }

  check = () => {
    const { isAuth } = this.props.global;
    if(isAuth) {
      if(this.props.callback) {
        this.props.callback(isAuth);
      } else {
        return isAuth
      }
    } else {
      this.showSignModal();
    }
  }

  // 显示登录Modal
  showSignModal = () => {

    if(!this.flag) return;
    this.flag = false;

    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: true,
        signTabKey: '1',
      }
    });

    setTimeout(() => { this.flag = true }, 500);

  };

  render(){
    return(
      <span>
        {this.props.children}
      </span>
    )
  }

}
