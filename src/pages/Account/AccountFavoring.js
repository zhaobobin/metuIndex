/**
 * 账户 - 点赞
 */
import React from 'react'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';

@connect(state => ({
  global: state.global,
}))
export default class AccountFavoring extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      list: '',
      count: 0
    }
  }

  componentDidMount(){
    const { _id } = this.props.global.profileUser;
    this.queryList(_id);
  }

  queryList(_id){

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/request',
      url: `/users/${_id}/favoring/photos`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500)
        if (res.code === 0) {
          this.setState({
            loading: false,
            list: res.data.list,
            count: res.data.count
          });
        } else {
          this.props.dispatch(routerRedux.push('/404'));
        }
      }
    });
  }

  render(){
    return(
      <Row>
        <Col xs={0} sm={0} md={4} lg={6} />

        <Col xs={24} sm={24} md={16} lg={12}>

          点赞

        </Col>

        <Col xs={0} sm={0} md={4} lg={6} />
      </Row>
    )
  }

}
