/**
 * 发布照片 - 同时将照片保存到相册
 */
import React from 'react';
import styles from './Publish.less';

import PublishPhotoContent from '@/containers/Publish/PublishPhotoContent';
import PublishPhotoSlide from '@/containers/Publish/PublishPhotoSlide';

export default function PublishPhoto () {
  return(
    <div className={styles.container}>
      <div className={styles.left}>
        <PublishPhotoContent/>
      </div>
      <div className={styles.right}>
        <PublishPhotoSlide/>
      </div>
    </div>
  )
}
