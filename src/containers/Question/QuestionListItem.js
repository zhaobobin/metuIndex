import React from 'react';
import { Link } from 'dva/router';
import Moment from 'moment';
import logo from '@/assets/logo2.png';
import styles from './QuestionListItem.less';

export default function QuestionListItem ({ item, index }) {

  return(
    <div key={index} className={styles.item}>

      <div className={styles.body}>
        <Link to={`/question/${item._id}/${item.title}-by-${item.author.nickname}`} className={styles.thumb}>
          <img src={item.thumb ? item.thumb : logo} alt={item.title} />
        </Link>
        <div className={styles.info}>
          <h2><Link to={`/question/${item._id}/${item.title}-by-${item.author.nickname}`}>{item.title}</Link></h2>
          <p className={styles.desc}>{item.description}</p>
        </div>
      </div>

      <div className={styles.foot}>
        <p className={styles.topics}>
          {
            item.topics ?
              item.topics.map((item, index) => (
                <Link key={index} to={`/topic/${item._id}`}>{item.name}</Link>
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
