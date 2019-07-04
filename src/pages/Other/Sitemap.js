import React from 'react';
import { Row, Col } from 'antd'

export default class Sitemap extends React.Component {

  render(){

    return(

      <div style={{padding: '25px 0'}}>
        <Row>

          <Col xs={0} sm={0} md={3} lg={5}/>

          <Col xs={24} sm={24} md={18} lg={14}>

            <p>网站地图</p>

          </Col>

          <Col xs={0} sm={0} md={3} lg={5}/>

        </Row>
      </div>

    )
  }

}
