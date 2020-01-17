/**
 * 设置 - 屏蔽
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd'
import styles from './SettingsFilter.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsFilter extends React.Component {

  render(){

    // const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>屏蔽</strong>
          <span className={styles.desc}>用户黑名单/话题黑名单/不看他的动态</span>
        </div>

        <div className={styles.body}>
          <ul>

            <li>
              <p className={styles.p1}>
                <strong>用户黑名单</strong>
              </p>
              <p className={styles.p2}>
                <span>查看或撤销已屏蔽用户</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>话题黑名单</strong>
              </p>
              <p className={styles.p2}>
                <span>查看或撤销已屏蔽话题</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>不看他的动态</strong>
              </p>
              <p className={styles.p2}>
                <span>屏蔽已关注用户的动态</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

          </ul>
        </div>

      </div>
    )
  }
}
