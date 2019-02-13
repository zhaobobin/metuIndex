import React from 'react';
import { Link } from 'dva/router';
import { Row, Col } from 'antd';
import { ENV } from '~/utils/utils';
import styles from './GlobalHeader.less';

import logo from '~/assets/logo2.png'
import GlobalHeaderMenu from '~/components/Common/GlobalHeaderMenu'
import SignModal from '~/components/Common/SignModal'

function headerIsOpacity(pathname){
  let path = pathname.split('/')[1];
  return (path === '' || path === 'u')
}

export default class GlobalHeader extends React.Component {

  state = {
    pathname: this.props.location.pathname,
    headerOpacity: headerIsOpacity(this.props.location.pathname) ? styles.opacity : '',	  //导航默认样式
    headerFixed: ''
  };

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.state.pathname){
      this.hashChange(nextProps.location.pathname)
    }
  }

  //监控路由变化
  hashChange(pathname){
    window.scrollTo(0, 0);                                  //重置滚动
    if(headerIsOpacity(pathname)){
      this.setState({pathname: pathname, headerOpacity: styles.opacity});
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }else{
      this.setState({pathname: pathname, headerOpacity: ''})
    }
  }

  //监控滚动
  handleScroll(){
    let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if(scrollY > 0){
      this.setState({headerFixed: styles.fixed})
    }else{
      this.setState({headerFixed: ''})
    }
  }

  render(){

    const { navData, location } = this.props;
    const { headerFixed, headerOpacity } = this.state;

    return(
      <div className={styles.header+" "+headerFixed+" "+headerOpacity}>

        <Row>

          <Col xs={6} sm={6} md={3} lg={2}>
            <div className={styles.logo}>
              <Link to="/">
                <img src={logo} width="auto" height="100%" alt={ENV.appname}/>
              </Link>
            </div>
          </Col>

          <Col xs={0} sm={0} md={13} lg={14}>
            <GlobalHeaderMenu navData={navData} location={location}/>
          </Col>

          <Col xs={18} sm={18} md={8} lg={8}>
            <SignModal/>
          </Col>

        </Row>

      </div>
    )
  }

}
