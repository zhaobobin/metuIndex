/**
 * 设置 - 个人信息
 */
import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon } from 'antd'
import styles from './SettingsProfile.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsProfile extends React.Component {

  render(){

    const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>个人信息</strong>
          <a className={styles.action}>编辑</a>
        </div>

        <div className={styles.body}>
          <ul>
            <li>
              <label>昵称</label>
              <span>{currentUser.nickname}</span>
            </li>
            <li>
              <label>职业</label>
              <span>{currentUser.professional || '未设置'}</span>
            </li>
            <li>
              <label>城市</label>
              <span>{currentUser.location || '未设置'}</span>
            </li>
            <li>
              <label>性别</label>
              <span>{currentUser.gender || '未设置'}</span>
            </li>
            <li>
              <label>签名</label>
              <span>{currentUser.headline || '未设置'}</span>
            </li>
          </ul>
        </div>

      </div>
    )
  }
}
