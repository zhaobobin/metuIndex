import React from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import NotFound from "~/routes/Other/404";
import { ENV } from '~/utils/utils';

import GlobalHeader from '~/components/Common/GlobalHeader';
import GlobalFooter from '~/components/Common/GlobalFooter';
import GlobalContent from '~/components/Common/GlobalContent';

export default class BaseLayout extends React.Component {

  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let title = ENV.appname;
    getRouteData('UserLayout').forEach((item) => {
      if (item.path !== pathname) return;
      title = item.name + ' - ' + ENV.appname;
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

    const { getRouteData, navData, location } = this.props;

    const layout = (
      <Layout>
        <GlobalHeader navData={navData[0].children} location={location}/>

        <GlobalContent>

          <Switch>
            {
              getRouteData('UserLayout').map(item =>
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
            <Redirect exact from="/user" to="/user/login" />
            <Route component={NotFound} />
          </Switch>

        </GlobalContent>

        <GlobalFooter/>

      </Layout>
    );

    return(
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    )
  }

}
