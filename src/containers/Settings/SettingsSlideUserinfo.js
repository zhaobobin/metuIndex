import React from 'react';
import { Avatar, Button } from 'antd';
import styles from './SettingsSlideUserinfo.less'

export default function SettingsUserinfo ({ currentUser }) {

  return(
    <div className={styles.container}>

      <p className={styles.avatar}>
        {
          currentUser.avatar_url ?
            <Avatar src={currentUser.avatar_url + '?x-oss-process=style/thumb_s'} size={100} />
            :
            <Avatar icon="user" size={100} />
        }
      </p>

      <p className={styles.name}>
        {currentUser.nickname}
      </p>

    </div>
  )

}
