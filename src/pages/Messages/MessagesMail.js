/**
 * 消息中心 - 私信
 */
import React from 'react';
import { connect } from 'dva';
import styles from './Messages.less';

@connect(state => ({
  global: state.global
}))
export default class MessagesMail extends React.Component {

  render(){

    // const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        MessagesMail

      </div>
    )
  }
}
