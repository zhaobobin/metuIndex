/**
 * 消息中心 - 收藏
 */
import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon } from 'antd'
import styles from './Messages.less'

@connect(state => ({
  global: state.global
}))
export default class MessagesCollect extends React.Component {

  render(){

    const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        MessagesCollect

      </div>
    )
  }
}
