/*
 * 文章列表展示
 * <ArticleListShow data={list} />
 */
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import Moment from 'moment';
import logo from '../../assets/logo2.png';

import styles from './ArticleListShow.less';

export default class ArticleListShow extends PureComponent {

  render(){

    const list = this.props.data;
    //console.log(list)

    const dataList = list.length > 0 ?
      list.map((topic, index) => (
        <li key={index}>
          <div className={styles.item}>
            <Link to={`/${topic.category.catedir}/${topic._id}/${topic.title}-by-${topic.uid.nickname}`} className={styles.thumb}>
              <img src={topic.thumb ? topic.thumb : logo} alt={topic.title} />
            </Link>
            <div className={styles.info}>
              <h2><Link to={`/${topic.category.catedir}/${topic._id}/${topic.title}-by-${topic.uid.nickname}`}>{topic.title}</Link></h2>
              <p className={styles.desc}>{topic.description}</p>
            </div>
          </div>
          <div className={styles.related}>
            <p className={styles.tags}>
              {
                topic.tags ?
                  topic.tags.map((tag, index) => (
                    <Link key={index} to={`/tags/${tag}`}>{tag}</Link>
                  ))
                  : ''
              }
            </p>
            <p className={styles.handler}>
              <span><Icon type="user" /> {topic.uid.nickname}</span>
              <span><Icon type="clock-circle-o" /> {Moment(topic.createtime).format('YYYY-MM-DD')}</span>
              <span><Icon type="eye-o" /> {topic.views}</span>
              <span><Icon type="message" /> {topic.comments.length}</span>
            </p>
          </div>
        </li>
      ))
      : <div>暂无数据！</div>;

    return (
      <ul className={styles.articleList}>
        {dataList}
      </ul>
    )

  }

}
