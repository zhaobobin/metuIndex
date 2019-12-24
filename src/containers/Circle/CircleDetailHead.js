import React from 'react';
import { Row, Col, Avatar } from 'antd'
import styles from './CircleDetailHead.less'

export default function CircleDetailHead ({ detail }) {

  return(

    <div className={styles.container}>
      <Row>

        <Col xs={0} sm={0} md={3} lg={5} />

        <Col xs={24} sm={24} md={18} lg={14}>

          <div className={styles.content}>
            <div className={styles.avatar}>
              {
                detail.avatar_url ?
                  <Avatar src={detail.avatar_url} size={60} />
                  :
                  <Avatar icon="user" size={60} />
              }
            </div>
            <p className={styles.name}>{detail.name}</p>
            <p className={styles.desc}>{detail.description}</p>
          </div>

        </Col>

        <Col xs={0} sm={0} md={3} lg={5} />

      </Row>
    </div>

  )

}
