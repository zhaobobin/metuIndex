import React from 'react';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import { ENV } from '~/utils/utils';
import styles from './GlobalHeader.less';

import logo from '~/assets/logo2.png'
import GlobalHeaderMenu from '~/components/Common/GlobalHeaderMenu'

export default class GlobalHeaderMin extends React.Component {

  render(){

    const { navData, location } = this.props;

    return(
      <div className={styles.header}>

        <Row>

          <Col xs={6} sm={6} md={3} lg={2}>
            <div className={styles.logo}>
              <Link to="/">
                <img src={logo} width="auto" height="100%" alt={ENV.appname}/>
              </Link>
            </div>
          </Col>

          <Col xs={0} sm={0} md={13} lg={14}>
            <GlobalHeaderMenu navData={navData} location={location}/>
          </Col>

          <Col xs={18} sm={18} md={8} lg={8}>

          </Col>

        </Row>

      </div>
    )
  }

}
