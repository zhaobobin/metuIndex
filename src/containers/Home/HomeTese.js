import React from 'react';
import { Link } from 'dva/router';
import { Row, Col, Icon } from 'antd';
import styles from './HomeTese.less'

export default function HomeTese () {
  return(
    <div className={styles.container}>
      <Row>
        <Col xs={0} sm={0} md={4} lg={4} />
        <Col xs={24} sm={24} md={16} lg={16}>

          <Row>
            <Col xs={12} sm={12} md={6} lg={6} >
              <Link className={styles.item} to="/">
                <Icon type="search" />
                <h3>发现</h3>
                <p>他人镜头里的奇观</p>
              </Link>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} >
              <Link className={styles.item} to="/">
                <Icon type="team" />
                <h3>部落</h3>
                <p>以图会友，相互交流</p>
              </Link>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} >
              <Link className={styles.item} to="/">
                <Icon type="trophy" />
                <h3>活动</h3>
                <p>精彩活动，不容错过</p>
              </Link>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} >
              <Link className={styles.item} to="/">
                <Icon type="edit" />
                <h3>供稿</h3>
                <p>好照片能赚钱</p>
              </Link>
            </Col>
          </Row>

        </Col>
        <Col xs={0} sm={0} md={4} lg={4} />
      </Row>
    </div>
  )
}
