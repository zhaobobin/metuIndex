/**
 * 身份校验 - 发送短信验证码
 */
import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import ENV from '@/config/env'
import Storage from '@/utils/storage'

@connect(state => ({
  global: state.global,
}))
export default class AccountAuth extends React.Component {

  constructor(props){
    super(props);
    this.flag = true;
    this.state = {
      visible: false
    }
  }

  componentDidMount(){
    this.props.onRef(this);
  }



  render(){
    return(
      <Modal>

      </Modal>
    )
  }

}
