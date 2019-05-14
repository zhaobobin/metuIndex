/*
* 标签目录
* */
import React from 'react';
import { Link } from 'dva/router';
import {Row, Col, Card} from 'antd';

//import styles from './IndexBase.less';

export default class TagsExport extends React.Component {

  render(){

    const tag = this.props.match.params.tag;

    return(

      <Row>

        <Col xs={0} sm={0} md={2} lg={3} />

        <Col xs={24} sm={24} md={15} lg={13}>

          left

        </Col>

        <Col xs={0} sm={0} md={5} lg={5}>
          right
        </Col>

        <Col xs={0} sm={0} md={2} lg={3} />

      </Row>

    )
  }

}
