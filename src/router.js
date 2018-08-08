import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import cloneDeep from 'lodash/cloneDeep';
import { getNavData } from '~/common/nav';
import { getPlainNode } from '~/utils/utils';

import NotFound from "~/routes/Other/404";

function getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0]);
  return getPlainNode(route.children);
}

function getLayout(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

export default function RouterConfig({ history, app }) {

  const navData = getNavData(app);

  const BaseLayout = getLayout(navData, 'BaseLayout').component;
  const UserLayout = getLayout(navData, 'UserLayout').component;

  const passProps = {
    app,
    navData,
    getRouteData: (path) => {
      return getRouteData(navData, path);
    },
  };

  return (
    <Router history={history}>
      <Switch>
        <Route path="/user" render={props => <UserLayout {...props} {...passProps} />} />
        <Route path="/" render={props => <BaseLayout {...props} {...passProps} />} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
