import React from 'react';
import { Row, Col } from 'antd';
import { ENV } from '@/utils'
import styles from './GlobalHeader.less';

import logo from '@/assets/logo2.png'
import GlobalHeaderMenu from '@/components/Common/GlobalHeaderMenu'
import GlobalHeaderSign from '@/components/Common/GlobalHeaderSign'

function headerIsOpacity(pathname){
  let path = pathname.split('/')[1];
  return (path === '' || path === 'users')
}

export default class GlobalHeader extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      pathname: props.location.pathname,
      headerOpacity: headerIsOpacity(props.location.pathname) ? styles.opacity : '',	  //导航默认样式
      headerFixed: props.location.pathname === '/' ? styles.fixed : ''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.state.pathname){
      this.hashChange(nextProps.location.pathname)
    }
  }

  //监控路由变化
  hashChange(pathname){
    // window.scrollTo(0, 0);                                  //重置滚动
    const path = pathname.split('/')[1];
    switch(path){
      case '':
        window.addEventListener('scroll', this.handleScroll, false);
        this.setState({pathname: pathname, headerOpacity: styles.opacity, headerFixed: styles.fixed});
        break;
      case 'edit':
        window.addEventListener('scroll', this.handleScroll, false);
        this.setState({pathname: pathname, headerOpacity: '', headerFixed: styles.fixed});
        break;
      case 'users':
        window.removeEventListener('scroll', this.handleScroll, false);
        this.setState({pathname: pathname, headerOpacity: styles.opacity, headerFixed: ''});
        break;
      default:
        window.removeEventListener('scroll', this.handleScroll, false);
        this.setState({ pathname: pathname, headerOpacity: '', headerFixed: '' });
        break;
    }
  }

  //监控滚动
  handleScroll = () => {
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
              <a href="/">
                <img src={logo} width="auto" height="100%" alt={ENV.appname}/>
              </a>
            </div>
          </Col>

          <Col xs={0} sm={0} md={13} lg={14}>
            <GlobalHeaderMenu navData={navData} location={location}/>
          </Col>

          <Col xs={18} sm={18} md={8} lg={8}>
            <GlobalHeaderSign/>
          </Col>

        </Row>

      </div>
    )
  }

}
