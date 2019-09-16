import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import ENV from '@/config/env'
import styles from './SettingsAccount.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsAccount extends React.Component {

  render(){

    return(
      <div className={styles.container}>

        SettingsAccount

      </div>
    )
  }
}
