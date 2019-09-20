/**
 * 设置 - 布局
 */
import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { Row, Col } from 'antd';
import NotFound from "@/pages/Other/404";
import styles from './_layout.less'

import LoadingBg from '@/components/Common/LoadingBg'
import SlideDrawer from '@/components/Common/SlideDrawer'
import SlideMenu from '@/components/Common/SlideMenu'

import RouteExtend from '@/components/Common/RouteExtend'
const Routes = RouteExtend('messages');

@connect(state => ({
  global: state.global
}))
export default class _layout extends React.Component {

  constructor(props){
    super(props);
    this.loading = true;
    this.state = {

    }
  }

  componentDidMount(){
    window.scrollTo(0, 0);
    this.queryUserDetail()
  }

  queryUserDetail(){
    this.props.dispatch({
      type: 'global/accountDetail',
      payload: {},
      callback: () => {
        this.loading = false;
      }
    })
  }

  render(){

    const { isAuth, currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        {
          this.loading ?
            <LoadingBg
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            />
            :
            <Row>
              <Col xs={0} sm={0} md={0} lg={1} xl={2} xxl={4}/>

              <Col xs={24} sm={24} md={24} lg={22} xl={20} xxl={16}>

                <div className={styles.main}>
                  <Row>

                    <Col xs={0} sm={0} md={5} lg={5}>
                      <div className={styles.slide}>
                        <SlideMenu routes={Routes}/>
                      </div>
                    </Col>

                    <Col xs={24} sm={24} md={0} lg={0}>
                      <SlideDrawer routes={Routes} title="消息中心" />
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
                              <Redirect exact from='/messages' to='/messages/favor' />
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
        }

      </div>
    )
  }
}
