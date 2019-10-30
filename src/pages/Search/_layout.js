/**
 * 搜索
 * q [String] 关键词
 * type [String] 分类：综合(content)、用户(user)、文章(article)、图片(photo)、话题(topic)、提问(answer)
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Affix, Menu } from 'antd';
import { getUrlParams } from "@/utils/utils"
import styles from './_layout.less';

// import PhotoListQuery from '@/blocks/Photo/PhotoListQuery';

@connect(state => ({
  global: state.global,
}))
export default class _layout extends React.Component {

  render(){

    const query = getUrlParams();

    const type = query.type || 'content',
      q = query.q ? decodeURIComponent(query.q) : '';

    return(
      <div className={styles.container}>

      <Affix>
        <Menu
          mode="horizontal"
          selectedKeys={[type]}
        >
          <Menu.Item key="content">
            <Link to={`/search?type=content&q=${q}`}>综合</Link>
          </Menu.Item>
          <Menu.Item key="user">
            <Link to={`/search?type=user&q=${q}`}>用户</Link>
          </Menu.Item>
          <Menu.Item key="article">
            <Link to={`/search?type=article&q=${q}`}>文章</Link>
          </Menu.Item>
          <Menu.Item key="photo">
            <Link to={`/search?type=photo&q=${q}`}>图片</Link>
          </Menu.Item>
          <Menu.Item key="topic">
            <Link to={`/search?type=topic&q=${q}`}>话题</Link>
          </Menu.Item>
          <Menu.Item key="answer">
            <Link to={`/search?type=answer&q=${q}`}>提问</Link>
          </Menu.Item>
        </Menu>
      </Affix>

        <div className={styles.content}>
          {type}
        </div>

      </div>
    )
  }

}
