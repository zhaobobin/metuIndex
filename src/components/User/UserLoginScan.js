import React from 'react';
import styles from './UserLoginScan.less'

export default class UserLoginScan extends React.Component {

  render(){
    return(
      <div className={styles.scan}>
        <h4>
          <p>
            <span>微信扫码 安全登录</span>
          </p>
          <hr/>
        </h4>

      </div>
    )
  }

}
