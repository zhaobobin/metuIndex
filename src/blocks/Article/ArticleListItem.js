import React from 'react';
import { Link } from 'dva/router';
import Moment from 'moment';
import logo from '@/assets/logo2.png';
import styles from './ArticleListItem.less';

export default function ArticleListItem ({ item, index }) {

  return(
    <div key={index} className={styles.item}>

      <div className={styles.body}>
        <Link to={`/graphic/${item._id}/${item.title}-by-${item.author.nickname}`} className={styles.thumb}>
          <img src={item.thumb ? item.thumb : logo} alt={item.title} />
        </Link>
        <div className={styles.info}>
          <h2><Link to={`/graphic/${item._id}/${item.title}-by-${item.author.nickname}`}>{item.title}</Link></h2>
          <p className={styles.desc}>{item.description}</p>
        </div>
      </div>

      <div className={styles.foot}>
        <p className={styles.tags}>
          {
            item.tags ?
              item.tags.map((tag, index) => (
                <Link key={index} to={`/tags/${tag}`}>{tag}</Link>
              ))
              : ''
          }
        </p>
        <p className={styles.handler}>
          <span>{item.author.nickname}</span>
          <span>{Moment(item.create_at).format('YYYY-MM-DD')}</span>
          <span>{item.view_number || 0} 阅读</span>
          <span>{item.comment_number || 0} 评论</span>
        </p>
      </div>

    </div>
  )

}
