/**
 * 圈子列表 - item
 */
import React from 'react';
import { Link } from 'dva/router';
import { Avatar } from 'antd';
import styles from './CircleListItem.less';

export default function CircleListItem ({ item }) {

  return (
    <div className={styles.item}>
      <Link to={`/community/circle/detail/${item._id}`}>
        <div className={styles.head}>
          <div className={styles.avatar}>
            {
              item.avatar_url ?
                <Avatar src={item.avatar_url} size={90} />
                :
                <Avatar icon="user" size={90} />
            }
          </div>
          <p className={styles.name}>{item.name}</p>
          <p className={styles.desc}>{item.description}</p>
          <p className={styles.info}>
            <span>成员：{item.member_number}</span>
            <span>作品：{item.photo_number}</span>
            <span>活动：{item.activity_number}</span>
          </p>
        </div>
      </Link>
    </div>
  )

};
