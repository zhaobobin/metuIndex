import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Affix, Menu } from 'antd';
import styles from './Community.less';

import PhotosListQuery from '@/blocks/Photo/PhotosListQuery';

@connect(state => ({
  global: state.global,
}))
export default class Community extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      pathname: this.props.location.pathname,
      key: '',
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.state.pathname) {
      this.setState({ pathname: nextProps.location.pathname })
    }
  }

  render() {

    const { pathname } = this.state;
    const keyword = pathname.split('/')[2] ? pathname.split('/')[2] : null,
      current = keyword ? keyword.split('-')[0] : 'popular';

    const queryOption = {
      keyword: current,
      itemsPerPage: 6,                 //每页数量
    };

    return (
      <div className={styles.container}>

      <Affix>
        <Menu
          mode="horizontal"
          selectedKeys={[current]}
        >
          <Menu.Item key="popular">
            <Link to="/community/popular">热门</Link>
          </Menu.Item>
          <Menu.Item key="editor">
            <Link to="/community/editor">推荐</Link>
          </Menu.Item>
          <Menu.Item key="new">
            <Link to="/community/new">最新</Link>
          </Menu.Item>
          <Menu.Item key="人像">
            <Link to="/community/人像">人像</Link>
          </Menu.Item>
          <Menu.Item key="人文">
            <Link to="/community/人文">人文</Link>
          </Menu.Item>
          <Menu.Item key="风光">
            <Link to="/community/风光">风光</Link>
          </Menu.Item>
        </Menu>
      </Affix>

        <Row>
          <Col xs={0} sm={0} md={1} lg={1} />
          <Col xs={24} sm={24} md={22} lg={22}>

            <PhotosListQuery api="api/PhotosList" {...queryOption} />

          </Col>
          <Col xs={0} sm={0} md={1} lg={1} />
        </Row>

      </div>
    )
  }

}
