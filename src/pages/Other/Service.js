import React from 'react';
import { Row, Col } from 'antd'

import ArticleDetailShow from '@/blocks/Article/ArticleDetailShow'
import ServiceHtml from './ServiceHtml'

export default class Service extends React.Component {

  render(){

    const detail = {
      title: '迷图网摄影社区网络服务使用协议',
      content: ServiceHtml
    };

    return(

      <div style={{padding: '25px 0'}}>
        <Row>

          <Col xs={0} sm={0} md={3} lg={5}/>

          <Col xs={24} sm={24} md={18} lg={14}>

            <ArticleDetailShow detail={detail}/>

          </Col>

          <Col xs={0} sm={0} md={3} lg={5}/>

        </Row>
      </div>

    )
  }

}
