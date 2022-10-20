import React from 'react';
// import { Row, Col } from 'antd';

import PhotoListQuery from '@/blocks/Photo/PhotoListQuery';

export default function PhotoLayout (props) {

  return(
    <PhotoListQuery url="/photos" {...props.queryOption} />
  )

}
