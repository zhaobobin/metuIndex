import React from 'react';
import { Link, NavLink, Route, Redirect, Switch } from 'dva/router';
import DocumentTitle from 'react-document-title';
import NotFound from "~/pages/Other/404";
import { ENV } from '~/utils/utils';

import styles from './DocLayout.less'
import logo from '~/assets/logo2.png'

export default class DocLayout extends React.Component {

  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    const routeData = getRouteData('DocLayout');
    let title = '';
    for(let i in routeData){
      if (pathname.indexOf(routeData[i].key) > -1) {
        title = routeData[i].name + ' - ' + ENV.appname;
      }
    }
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

    const { getRouteData } = this.props;
    const Routes = getRouteData('DocLayout');

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
          <div className={styles.menu}>
            <ul>
              {
                Routes.map(item => (
                  item.isHide ?
                    null
                    :
                    <li key={item.path} >
                      <p>
                        <NavLink
                          activeClassName={styles.active}
                          to={item.path}
                        >
                          {item.name}
                        </NavLink>
                      </p>
                    </li>
                ))
              }
            </ul>
          </div>
        </div>

        <div className={styles.container}>

          <div className={styles.content}>
            <Switch>
              {
                Routes.map(item =>
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
              <Redirect exact from="/doc" to="/doc/button" />
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
