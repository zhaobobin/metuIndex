/**
 * 设置 - 消息提醒
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd'
import styles from './SettingsMessage.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsMessage extends React.Component {

  render(){

    // const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>消息提醒</strong>
          <span className={styles.desc}>私信设置/邀请设置/赞同与赞赏/关注/邮件设置</span>
        </div>

        <div className={styles.body}>
          <ul>

            <li>
              <p className={styles.p1}>
                <strong>私信设置</strong>
              </p>
              <p className={styles.p2}>
                <span>允许谁给我发私信</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>邀请/评论消息设置</strong>
              </p>
              <p className={styles.p2}>
                <span>有人对我发出邀请时，我会收到消息通知</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>赞同/赞赏消息设置</strong>
              </p>
              <p className={styles.p2}>
                <span>有人对我赞同或赞赏时，我会收到消息通知</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>关注消息设置</strong>
              </p>
              <p className={styles.p2}>
                <span>我的关注有新动态时，我会收到消息通知</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>邮件设置</strong>
              </p>
              <p className={styles.p2}>
                <span>重要事件发生时，我将会收到邮件提醒</span>
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
