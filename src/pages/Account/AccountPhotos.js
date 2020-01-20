/**
 * 账户 - 图片
 */
import React from 'react'
import { connect } from 'dva';
import { Row, Col } from 'antd';

import PhotoListQuery from '@/blocks/Photo/PhotoListQuery';
import CusEmpty from '@/components/Common/CusEmpty'

@connect(state => ({
  global: state.global,
}))
export default class AccountPhotos extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      count: null
    }
  }

  queryCallback = (count) => {
    this.setState({
      count
    })
  }

  render(){

    const user_id = this.props.global.profileUser._id;
    const url = `/users/${user_id}/photos`
    const { count } = this.state;

    return(
      <Row>
        <Col xs={0} sm={0} md={1} lg={1} />

        <Col xs={24} sm={24} md={22} lg={22}>

          <PhotoListQuery url={url} category="" callback={this.queryCallback} />

          {
            count === 0 ?
              <CusEmpty/>
              :
              null
          }

        </Col>

        <Col xs={0} sm={0} md={1} lg={1} />
      </Row>
    )
  }

}
