import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Menu } from 'antd';
import styles from './Vision.less';

import PhotosListQuery from '~/components/Photo/PhotosListQuery';

@connect(state => ({
  global: state.global,
}))
export default class Vision extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      pathname: this.props.location.pathname,
      headerFixed: '',
      key: '',
    }
  }

  componentDidMount(){
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.state.pathname) {
      this.setState({pathname: nextProps.location.pathname})
    }
  }

  //监控滚动
  handleScroll(){
    let top = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
    if(top > 64){
      this.setState({headerFixed: styles.fixed})
    }else{
      this.setState({headerFixed: ''})
    }
  }

  render(){

    const {pathname, headerFixed} = this.state;
    const keyword = pathname.split('/')[2] ? pathname.split('/')[2] : null,
      current = keyword ? keyword.split('-')[0] : 'popular';

    const queryOption = {
      keyword: current,
      itemsPerPage: 6,                 //每页数量
    };

    return(
      <div className={styles.container}>

        <div className={styles.menu+" "+headerFixed}>
          <Row>
            <Col xs={0} sm={0} md={1} lg={1} />
            <Col xs={24} sm={24} md={22} lg={22}>

              <Menu
                mode="horizontal"
                selectedKeys={[current]}
                style={{background: 'none', border: 'none'}}
              >
                <Menu.Item key="popular">
                  <Link to="/vision/popular">热门</Link>
                </Menu.Item>
                <Menu.Item key="editor">
                  <Link to="/vision/editor">推荐</Link>
                </Menu.Item>
                <Menu.Item key="new">
                  <Link to="/vision/new">最新</Link>
                </Menu.Item>
                <Menu.Item key="人像">
                  <Link to="/vision/人像">人像</Link>
                </Menu.Item>
                <Menu.Item key="人文">
                  <Link to="/vision/人文">人文</Link>
                </Menu.Item>
                <Menu.Item key="风光">
                  <Link to="/vision/风光">风光</Link>
                </Menu.Item>
              </Menu>

            </Col>
            <Col xs={0} sm={0} md={1} lg={1} />
          </Row>
        </div>

        <PhotosListQuery {...queryOption} />

      </div>
    )
  }

}
