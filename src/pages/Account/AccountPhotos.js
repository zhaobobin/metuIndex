/**
 * 账户 - 图片
 */
import React from 'react'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';

import PhotoListQuery from '@/blocks/Photo/PhotoListQuery';

@connect(state => ({
  global: state.global,
}))
export default class AccountPhotos extends React.Component {

  render(){

    const user_id = this.props.global.profileUser._id;
    const url = `/users/${user_id}/photos`

    return(
      <Row>
        <Col xs={0} sm={0} md={1} lg={1} />

        <Col xs={24} sm={24} md={22} lg={22}>

          <PhotoListQuery url={url} />

        </Col>

        <Col xs={0} sm={0} md={1} lg={1} />
      </Row>
    )
  }

}
