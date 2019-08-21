import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import cloneDeep from 'lodash/cloneDeep';
import { getNavData } from '@/routes/nav';
import { getPlainNode } from '@/utils/utils';
import NotFound from "@/pages/Other/404";

//国家化
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/zh'
import en_US from '@/locales/en_US';
import zh_CN from '@/locales/zh_CN';
addLocaleData(enLocaleData);
const currentLang = navigator.language;  //navigator.language
const messages = {
  'en-US': en_US,
  'zh-CN': zh_CN,
};
//国家化 end!

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
    <IntlProvider locale={currentLang} messages={messages[currentLang]}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <UserLayout {...props} {...passProps} />} />
          <Route path="/" render={props => <BaseLayout {...props} {...passProps} />} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </IntlProvider>
  );
}
