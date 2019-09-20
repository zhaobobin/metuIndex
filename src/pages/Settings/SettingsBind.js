/**
 * 设置 - 帐号绑定
 */
import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon } from 'antd'
import ENV from '@/config/env'
import styles from './SettingsBind.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsBind extends React.Component {

  render(){

    const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>账号绑定</strong>
          <span className={styles.desc}>帐号设置/个性域名</span>
        </div>

        <div className={styles.body}>
          <ul>

            <li>
              <p className={styles.icon}>
                <Icon type="mail" />
              </p>
              <p className={styles.p1}>
                <span><strong>邮箱</strong></span>
                {
                  currentUser.email ?
                    <span>{currentUser.email} ，{currentUser.email_auth ? '已验证' : '未验证'}</span>
                    :
                    '未绑定'
                }
              </p>
              <p className={styles.p2}>
                <span>可用邮箱加密码登录{ENV.appname}，可用邮箱找回密码</span>
              </p>
              <p className={styles.btns}>
                <Button>{currentUser.email ? '更改' : '绑定'}</Button>
                {
                  currentUser.email_auth ?
                    null
                    :
                    <Button>验证</Button>
                }
              </p>
            </li>

            <li>
              <p className={styles.icon}>
                <Icon type="mobile" />
              </p>
              <p className={styles.p1}>
                <span><strong>手机</strong></span>
                <span>{currentUser.mobile || '未绑定'}</span>
              </p>
              <p className={styles.p2}>
                <span>可用手机号加密码登录{ENV.appname}，可通过手机号找回密码</span>
              </p>
              <p className={styles.btns}>
                <Button>{currentUser.mobile ? '更改' : '绑定'}</Button>
              </p>
            </li>

            <li>
              <p className={styles.icon}>
                <Icon type="safety" />
              </p>
              <p className={styles.p1}>
                <span><strong>密码</strong></span>
                <span>{currentUser.psd_bind ? '已设置' : '未设置'}</span>
              </p>
              <p className={styles.p2}>
                <span>用于保护账号信息和登录安全</span>
              </p>
              <p className={styles.btns}>
                <Button>{currentUser.psd_bind ? '更改' : '设置'}</Button>
              </p>
            </li>

            <li>
              <p className={styles.icon}>
                <Icon type="message" />
              </p>
              <p className={styles.p1}>
                <span><strong>社交帐号</strong></span>
              </p>
              <p className={styles.p2}>
                <span>绑定第三方账号，可以直接登录，还可以将内容同步到以下平台，与更多好友分享</span>
              </p>
              <p className={styles.third}>
                <span className={styles.wechat + " " + (currentUser.wechat_bind ? styles.bind : null)}>
                  <Icon type="wechat" />
                  <a>{currentUser.wechat_bind ? '解绑' : '绑定'}微信</a>
                </span>
                <span className={styles.weibo + " " + (currentUser.weibo_bind ? styles.bind : null)}>
                  <Icon type="weibo" />
                  <a>{currentUser.weibo_bind ? '解绑' : '绑定'}微博</a>
                </span>
                <span className={styles.qq + " " + (currentUser.qq_bind ? styles.bind : null)}>
                  <Icon type="qq" />
                  <a>{currentUser.qq_bind ? '解绑' : '绑定'}QQ</a>
                </span>
              </p>
            </li>

          </ul>
        </div>

      </div>
    )
  }
}
