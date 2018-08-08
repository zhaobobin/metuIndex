import React from 'react';
import { Link } from 'dva/router';
import { ENV } from '~/utils/utils'
import styles from './GlobalFooter.less';

const menus = [
  {
    label: '新手指引',
    children: [
      {label: '新手须知', url: ''},
      {label: '风控管理', url: ''},
      {label: '收费准则', url: ''},
      {label: '帮助中心', url: ''}
    ]
  },
  {
    label: '新闻资讯',
    children: [
      {label: '网站公告', url: ''},
      {label: '公司新闻', url: ''},
      {label: '行业资讯', url: ''},
      {label: '媒体报道', url: ''}
    ]
  },
  {
    label: '关于我们',
    children: [
      {label: '公司介绍', url: ''},
      {label: '合作机构', url: ''},
      {label: '联系我们', url: ''},
      {label: '网站地图', url: ''}
    ]
  },
];

const GlobalFooter = (props) => {

  const menuList = menus.map((item, index) => (
    <dl key={index}>
      <dt>{item.label}</dt>
      {
        item.children.map((topic, i) => (
          <dd key={i}><Link to={`/${topic.url}`}>{topic.label}</Link></dd>
        ))
      }
    </dl>
  ));

  return(
    <div className={styles.container}>
      <div className={styles.footContent}>
        <div className={styles.top}>
          {menuList}
          <ul className={styles.kefu}>
            <li><span className={styles.size18}>在线客服、投诉</span></li>
            <li><span className={styles.size26}>{ENV.hotline}</span></li>
            <li><span className={styles.size26}>{ENV.email}</span></li>
            <li>工作时间：{ENV.worktime}</li>
          </ul>
        </div>
        <div className={styles.bottom}>
          <p>
            <span>{ENV.icp}</span>
            <span>|</span>
            <span>{ENV.beian}</span>
          </p>
          <p>
            <span>{ENV.address}</span>
            <span>|</span>
            <span>{ENV.copyright}</span>
          </p>
        </div>
      </div>
    </div>
  )
};

export default GlobalFooter
