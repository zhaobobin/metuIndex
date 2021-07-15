/**
 * 编辑照片
 */
import React from 'react';
import styles from './Publish.less';

import PublishPhotoContent from '@/containers/Publish/PublishPhotoContent';
import PublishPhotoSlide from '@/containers/Publish/PublishPhotoSlide';

export default function AccountPhotoEdit () {
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
