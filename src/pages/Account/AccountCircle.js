/**
 * 账户 - 圈子
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

import UserCircleListQuery from '@/blocks/Circle/UserCircleListQuery';

@connect(state => ({
  global: state.global,
}))
export default class AccountCircle extends React.Component {

  render(){
    const { profileUser } = this.props.global;
    return(
      <Row>
        <Col xs={0} sm={0} md={4} lg={6} />

        <Col xs={24} sm={24} md={16} lg={12}>

          <UserCircleListQuery userId={profileUser._id} />

        </Col>

        <Col xs={0} sm={0} md={4} lg={6} />
      </Row>
    )
  }

}
