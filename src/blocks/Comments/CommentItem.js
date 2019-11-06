import React from 'react';
// import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import Moment from 'moment';
import styles from './CommentList.less'

import UserinfoPopover from '@/blocks/User/UserinfoPopover'

// @connect(state => ({
//   global: state.global,
// }))
export default function CommentItem ({item, action, userId, theme}) {

  return(
    <div className={styles.item + ' '+ theme}>

      <div className={styles.avatar}>
        <UserinfoPopover id={item.author._id}>
          <Link to={`/users/${item.author.username}`}>
            {
              item.author.avatar ?
                <img src={item.author.avatar + '?x-oss-process=style/thumb_s'} alt="avatar" />
                :
                <Icon type="user" />
            }
          </Link>
        </UserinfoPopover>
      </div>

      <div className={styles.content}>

        <div className={styles.head}>
          <span>
            <Link className={styles.username} to={`/users/${item.author.username}`}>
              {item.author.nickname}
            </Link>
          </span>
          { item.reply_to ? <span>回复</span> : null }
          {
            item.reply_to ?
              <Link className={styles.username} to={`/users/${item.reply_to.username}`}>
                {item.reply_to.nickname}
              </Link>
              :
              null
          }
        </div>

        <div className={styles.body}>
          <p>{item.content}</p>
        </div>

        <div className={styles.foot}>
          <span className={styles.date}>{Moment(item.create_at).format('YYYY-MM-DD')}</span>
          {
            userId === item.author._id ?
              null
              :
              <span className={styles.action}>
                <a onClick={() => action.report(item)} className={styles.report}>举报</a>
                <a onClick={() => action.reply(item)} className={styles.reply}>回复</a>
                <a onClick={() => action.favor(item)} className={styles.favor}>
                  <Icon type="like" theme={item.favoring_state ? 'filled' : null} />
                  <em>{item.favor_number ? item.favor_number : null}</em>
                </a>
              </span>
          }
        </div>

        {/* 回复列表 begin */}
        <div className={styles.replyList}>
          {
            item.replyList ?
              item.replyList.map((topic, k) => (
                <div key={k} className={styles.item}>

                  <div className={styles.avatar}>
                    <UserinfoPopover id={topic.author._id}>
                      <Link to={`/users/${topic.author.username}`}>
                        {
                          topic.author.avatar ?
                            <img src={topic.author.avatar + '?x-oss-process=style/thumb_s'} alt="avatar" />
                            :
                            <Icon type="user" />
                        }
                      </Link>
                    </UserinfoPopover>
                  </div>

                  <div className={styles.content}>

                    <div className={styles.body}>
                      <p>
                        <span className={styles.username}><Link to={`/users/${topic.author.username}`}>{topic.author.nickname}</Link> </span>
                        {
                          topic.reply_to ?
                            <span>
                              回复
                              <Link to={`/users/${topic.reply_to.username}`}>{topic.reply_to.nickname}</Link>
                            </span>
                            :
                            null
                        }
                        <span>{topic.content}</span>
                      </p>
                    </div>

                    <div className={styles.foot}>
                      <span className={styles.date}>{Moment(topic.create_at).format('YYYY-MM-DD')}</span>
                      <span className={styles.favor}>
                        <a onClick={() => action.favor(topic)}>点赞</a>
                        <em>{topic.favor_number ? topic.favor_number : null}</em>
                      </span>
                      {
                        userId === topic.author._id ?
                          null
                          :
                          <span className={styles.action}>
                            <a onClick={() => action.reply(topic)}>回复</a>
                            <a onClick={() => action.report(topic)}>举报</a>
                          </span>
                      }
                    </div>

                  </div>

                </div>
              ))
              :
              null
          }
        </div>
        {/* 回复列表 end */}

      </div>


    </div>
  )

}
