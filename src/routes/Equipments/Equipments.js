/*
 * 器材
 */
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { Row, Col, Menu } from 'antd';

import styles from './Equipments.less';

import EquipmentExplore from '~/components/Equipment/EquipmentExplore'
import EquipmentList from '~/components/Equipment/EquipmentList'
import EquipmentDetail from '~/components/Equipment/EquipmentDetail'

export default class Equipments extends PureComponent {

  state = {
    pathname: this.props.location.pathname,
    headerFixed: '',
  };

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
      current = keyword ? keyword.split('-')[0] : 'explore';

    return(

      <div className={styles.container}>

        <div className={styles.menu+" "+headerFixed}>
          <Row>
            <Col xs={0} sm={0} md={3} lg={5} />
            <Col xs={24} sm={24} md={18} lg={14}>

              <Menu
                mode="horizontal"
                selectedKeys={[current]}
                style={{background: 'none', border: 'none'}}
              >
                <Menu.Item key="explore">
                  <Link to="/equipments/explore">全部</Link>
                </Menu.Item>
                <Menu.Item key="camera">
                  <Link to="/equipments/camera">相机</Link>
                </Menu.Item>
                <Menu.Item key="lens">
                  <Link to="/equipments/lens">镜头</Link>
                </Menu.Item>
                {/*<Menu.Item key="phone">*/}
                  {/*<Link to="/equipments/phone">手机</Link>*/}
                {/*</Menu.Item>*/}
              </Menu>

            </Col>
            <Col xs={0} sm={0} md={3} lg={5} />
          </Row>
        </div>

        <div className={styles.content}>
          <Row>
            <Col xs={0} sm={0} md={3} lg={5} />
            <Col xs={24} sm={24} md={18} lg={14}>

              {
                current === 'explore' ?
                  <EquipmentExplore />
                  :
                  keyword.split('-').length > 2 ?
                  <EquipmentDetail keyword={keyword}/>
                  :
                  <EquipmentList keyword={keyword}/>
              }

            </Col>
            <Col xs={0} sm={0} md={3} lg={5} />
          </Row>
        </div>

      </div>

    )

  }

}
