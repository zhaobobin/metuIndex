import React from 'react';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import ENV from '@/config/env'
import styles from './GlobalFooter.less';

const center = {
  xs: 22,
  sm: 20,
  md: 16,
  lg: 16
};

const slide = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 4
};

export default function GlobalFooter (props) {

  return(
    <div className={styles.container}>
      <Row>
        <Col {...slide}/>
        <Col {...center}>
          <div className={styles.footContent}>
            <div className={styles.top}>
              <p className={styles.title}><strong>{ENV.hometitle}</strong></p>
              <p className={styles.desc}>{ENV.description}</p>
            </div>
            <div className={styles.bottom}>
              <p>
                <span>{ENV.icp}</span>
                <span>|</span>
                <span>{ENV.beian}</span>
                <span>|</span>
                <span>{ENV.copyright}</span>
              </p>
              <p>
                <span><Link to="/help">帮助中心</Link></span>
                <span>|</span>
                <span><Link to="/service">服务条款</Link></span>
                <span>|</span>
                <span><Link to="/contact">联系我们</Link></span>
                <span>|</span>
                <span><Link to="/sitemap">网站地图</Link></span>
                <span>|</span>
                <span><Link to="/doc">开发文档</Link></span>
              </p>
            </div>
          </div>
        </Col>
        <Col {...slide}/>
      </Row>
    </div>
  )
};
