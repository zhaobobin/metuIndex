/**
 * Help
 */
import React from 'react';
import { Row, Col } from 'antd'

export default class Help extends React.Component {

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render(){

    return(

      <div style={{padding: '25px 0'}}>
        <Row>

          <Col xs={0} sm={0} md={3} lg={5}/>

          <Col xs={24} sm={24} md={18} lg={14}>

            <p>帮助中心</p>

          </Col>

          <Col xs={0} sm={0} md={3} lg={5}/>

        </Row>
      </div>

    )
  }

}
