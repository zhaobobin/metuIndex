import React from 'react';
import { Link, Route, Redirect, Switch } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { injectIntl } from 'react-intl';
import NotFound from "~/pages/Other/404";
import styles from './DocLayout.less'

import logo from '~/assets/logo2.png'
import DocSlideMenu from '~/blocks/Doc/DocSlideMenu'

class DocLayout extends React.Component {

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

  render(){

    const { getRouteData, navData } = this.props;

    const layout = (
      <div className={styles.docLayout}>

        <div className={styles.head}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="去投网logo"/>
            </Link>
          </div>
        </div>

        <div className={styles.slide}>
          <DocSlideMenu navData={navData[2].children}/>
        </div>

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
