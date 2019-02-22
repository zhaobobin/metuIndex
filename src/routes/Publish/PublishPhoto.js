/**
 * 发布照片 - 同时将照片保存到相册
 */
import React from 'react';
import styles from './Publish.less';
import PublishPhotoContent from '~/components/Publish/PublishPhotoContent';
import PublishPhotoSlide from '~/components/Publish/PublishPhotoSlide';

export default function PublishArticle () {
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
