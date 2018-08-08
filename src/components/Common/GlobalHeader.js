import React from 'react';
import { Link } from 'dva/router';
import { ENV } from '~/utils/utils';
import styles from './GlobalHeader.less';

import logo from '~/assets/logo.png'
import MainMenu from '~/components/Common/MainMenu'

const GlobalHeader = (props) => {
  return(
    <div className={styles.container}>

      <div className={styles.top}>
        <div className={styles.topContent}>

          <div className={styles.topLeft}>
            <span>客服热线：<em className={styles.fontRed}>{ENV.hotline}</em></span>
            <span>市场有风险，出借需谨慎</span>
          </div>

          <div className={styles.topRight}>
            <span>您好游客，欢迎来到{ENV.appname}！</span>
            <span><Link to="/user/login">登录</Link></span>
            <span><Link to="/user/register">注册</Link></span>
          </div>

        </div>
      </div>

      <div className={styles.nav}>
        <div className={styles.navContent}>

          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} width="324" height="71" alt="去投网"/>
            </Link>
          </div>

          <div className={styles.menu}>
            <MainMenu navData={props.navData}/>
          </div>

        </div>
      </div>

    </div>
  )
};

export default GlobalHeader
