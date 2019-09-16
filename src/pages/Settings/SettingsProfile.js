import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import ENV from '@/config/env'
import styles from './SettingsProfile.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsProfile extends React.Component {

  render(){

    return(
      <div className={styles.container}>

        SettingsProfile

      </div>
    )
  }
}
