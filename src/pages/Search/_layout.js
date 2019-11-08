/**
 * 搜索
 * q [String] 关键词
 * type [String] 分类：综合(content)、图片(photo)、图文(article)、问答(question)、用户(user)、话题(topic)
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Affix, Menu } from 'antd';
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
      <div className={styles.main}>

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

        <div className={styles.container}>
          <Row>
            <Col xs={0} sm={0} md={2} lg={3} xl={5} />

            <Col xs={24} sm={24} md={14} lg={12} xl={10}>
              <div className={styles.content}>
                {type}
              </div>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6} xl={4}>
              <div className={styles.slide}>

              </div>
            </Col>

            <Col xs={0} sm={0} md={2} lg={3} xl={5} />
          </Row>
        </div>

      </div>
    )
  }

}
