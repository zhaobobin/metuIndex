import React from 'react';
import { Link, Route, Redirect, Switch } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { injectIntl } from 'react-intl';
import { Drawer, Icon, Row, Col } from 'antd'
import NotFound from "~/pages/Other/404";
import styles from './DocLayout.less'

import logo from '~/assets/logo2.png'
import DocSlideMenu from '~/blocks/Doc/DocSlideMenu'

class DocLayout extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false
    }
  }

  getPageTitle() {
    const { intl, location, getRouteData } = this.props;
    const { pathname } = location;
    const appname = intl.formatMessage({id: 'env.appname'});

    let title = appname;
    getRouteData('DocLayout').forEach((item) => {
      if (item.path !== pathname) return;
      let routeName = intl.formatMessage({id: item.id});   //路径名称
      title = routeName + ' - ' + intl.formatMessage({id: 'doc'}) + ' - ' + appname;
    });
    return title;
  }

  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render(){

    const { getRouteData, navData } = this.props;

    const layout = (
      <div className={styles.docLayout}>

        <div className={styles.head}>
          <Row>
            <Col xs={20} sm={20} md={20} lg={24}>
              <div className={styles.logo}>
                <Link to="/">
                  <img src={logo} alt="去投网logo"/>
                </Link>
              </div>
            </Col>
            <Col xs={4} sm={4} md={4} lg={0}>
              {/*<div className={styles.drawer}>*/}
                {/*<Icon type="ellipsis" onClick={this.showDrawer} />*/}
              {/*</div>*/}
            </Col>
          </Row>
        </div>

        <div className={styles.body}>
          <Row>
            <Col xs={0} sm={0} md={0} lg={5}>
              <div className={styles.slide}>
                <DocSlideMenu navData={navData[2].children}/>
              </div>
            </Col>
            {/*<Col span={0}>*/}
              {/*<div className={styles.drawer}>*/}
                {/*<Drawer*/}
                  {/*placement="left"*/}
                  {/*closable={false}*/}
                  {/*onClose={this.onClose}*/}
                  {/*visible={this.state.visible}*/}
                {/*>*/}
                  {/*<DocSlideMenu navData={navData[2].children}/>*/}
                {/*</Drawer>*/}
              {/*</div>*/}
            {/*</Col>*/}
            <Col xs={24} sm={24} md={24} lg={19}>
              <div className={styles.container}>

                <div className={styles.content}>
                  <Switch>
                    {
                      getRouteData('DocLayout').map(item =>
                        (
                          <Route
                            exact={item.exact}
                            key={item.path}
                            path={item.path}
                            component={item.component}
                          />
                        )
                      )
                    }
                    <Redirect exact from="/doc" to="/doc/introduce" />
                    <Route component={NotFound} />
                  </Switch>
                </div>

              </div>
            </Col>
          </Row>
        </div>

      </div>
    );

    return(
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    )
  }

}

export default injectIntl(DocLayout, {withRef: true});
