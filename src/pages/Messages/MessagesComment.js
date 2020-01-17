/**
 * 消息中心 - 评论
 */
import React from 'react';
import { connect } from 'dva';
import styles from './Messages.less'

@connect(state => ({
  global: state.global
}))
export default class MessagesComment extends React.Component {

  render(){

    // const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        MessagesComment

      </div>
    )
  }
}
