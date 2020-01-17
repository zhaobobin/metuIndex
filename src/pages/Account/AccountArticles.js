/**
 * 账户 - 文章
 */
import React from 'react'
import { connect } from 'dva';
import { Row, Col } from 'antd';

import ArticleListQuery from '@/blocks/Article/ArticleListQuery';

@connect(state => ({
  global: state.global,
}))
export default class AccountArticles extends React.Component {

  render(){

    const user_id = this.props.global.profileUser._id;
    const url = `/users/${user_id}/articles`

    return(
      <Row>
        <Col xs={0} sm={0} md={4} lg={6} />

        <Col xs={24} sm={24} md={16} lg={12}>

          <ArticleListQuery url={url} />

        </Col>

        <Col xs={0} sm={0} md={4} lg={6} />
      </Row>
    )
  }

}
