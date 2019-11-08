import React from 'react';
import { Row, Col, Affix, Menu } from 'antd';

import PhotoListQuery from '@/blocks/Photo/PhotoListQuery';

export default function PhotoLayout (props) {

  return(
    <Row>
      <Col xs={0} sm={0} md={1} lg={1} />
      <Col xs={24} sm={24} md={22} lg={22}>

        <div>
          <PhotoListQuery url="/photos" {...props.queryOption} />
        </div>

      </Col>
      <Col xs={0} sm={0} md={1} lg={1} />
    </Row>
  )

}
