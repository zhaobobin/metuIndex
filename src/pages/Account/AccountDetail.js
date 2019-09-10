/**
 * 账户 - 个人资料
 */
import React from 'react'
import { connect } from 'dva';
import {  routerRedux } from 'dva/router';
import { Row, Col } from 'antd';

@connect(state => ({
  global: state.global,
}))
export default class AccountDetail extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      detail: '',
      count: 0
    }
  }

  componentDidMount(){
    const { _id } = this.props.global.userInfo;
    this.queryDetail(_id);
  }

  queryDetail(_id){

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const include = 'address%zipcode%email%qq'

    this.props.dispatch({
      type: 'global/request',
      url: `/users/${_id}?include=${include}`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500)
        if (res.code === 0) {
          this.setState({
            loading: false,
            detail: res.data,
          });
        } else {
          this.props.dispatch(routerRedux.push('/404'));
        }
      }
    });
  }

  render(){
    return(
      <div>
        个人资料
      </div>
    )
  }

}
