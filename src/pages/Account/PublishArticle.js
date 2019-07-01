import React from 'react';
import styles from './Publish.less';

import PublishArticleContent from '~/containers/Publish/PublishArticleContent';
import PublishArticleSlide from '~/containers/Publish/PublishArticleSlide';

export default function PublishArticle () {
  return(
    <div className={styles.container}>
      <div className={styles.left}>
        <PublishArticleContent/>
      </div>
      <div className={styles.right}>
        <PublishArticleSlide/>
      </div>
    </div>
  )
}
