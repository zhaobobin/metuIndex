import React from 'react';
import styles from './Publish.less';

// import PublishArticleContent from '@/containers/Publish/PublishArticleContent';
import PublishEditor from '@/containers/Publish/PublishEditor';
import PublishArticleSlide from '@/containers/Publish/PublishArticleSlide';

export default function PublishArticle () {
  return(
    <div className={styles.container}>
      <div className={styles.left}>
        <PublishEditor model="Article"/>
      </div>
      <div className={styles.right}>
        <PublishArticleSlide/>
      </div>
    </div>
  )
}
