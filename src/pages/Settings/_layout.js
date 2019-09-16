/**
 * 设置 - 布局
 */
import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { Row, Col } from 'antd';
import NotFound from "@/pages/Other/404";
import styles from './_layout.less'

import SettingsSlideDrawer from '@/containers/Settings/SettingsSlideDrawer'
import SettingsSlideUserinfo from '@/containers/Settings/SettingsSlideUserinfo'
import SettingsSlideMenu from '@/containers/Settings/SettingsSlideMenu'
import RouteExtend from '@/components/Common/RouteExtend'
const Routes = RouteExtend('settings');

@connect(state => ({
  global: state.global
}))
export default class _layout extends React.Component {

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render(){

    const { isAuth, currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <Row>
          <Col xs={0} sm={0} md={0} lg={1} xl={2} xxl={4}/>

          <Col xs={24} sm={24} md={24} lg={22} xl={20} xxl={16}>

            <div className={styles.main}>
              <Row>

                <Col xs={0} sm={0} md={5} lg={5}>
                  <div className={styles.slide}>
                    <SettingsSlideUserinfo currentUser={currentUser}/>
                    <SettingsSlideMenu routes={Routes}/>
                  </div>
                </Col>

                <Col xs={24} sm={24} md={0} lg={0}>
                  <SettingsSlideDrawer routes={Routes}/>
                </Col>

                <Col xs={24} sm={24} md={19} lg={19}>
                  <div className={styles.content}>
                    {
                      isAuth ?
                        <Switch>
                          {
                            Routes.children.map(item => (
                              <Route
                                exact={item.exact}
                                key={item.path}
                                path={`/${Routes.path}/${item.path}`}
                                component={item.component}
                              />
                            ))
                          }
                          <Redirect exact from='/settings' to='/settings/bind' />
                          <Route component={NotFound} />
                        </Switch>
                        :
                        <Redirect to='/'/>
                    }
                  </div>
                </Col>

              </Row>
            </div>

          </Col>

          <Col xs={0} sm={0} md={0} lg={1} xl={2} xxl={4}/>
        </Row>

      </div>
    )
  }
}
