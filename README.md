### 克隆项目

  ```
  git clone git@github.com:zhaobobin/metuIndex.git
  
  cd metuIndex
  
  npm install
  
  npm start
  ```
  
### 手动安装

1、新建项目metuIndex

  ```
  npm install dva-cli -g
  
  dva new metuIndex
  
  cd metuIndex
  
  npm install
  
  npm start
  ```
  
2、安装依赖模块

  ```
  npm install antd babel-polyfill classnames dva-loading lodash moment react-container-query react-document-title --save
  
  npm install babel-plugin-import babel-plugin-module-resolver babel-plugin-transform-class-properties babel-plugin-transform-decorators-legacy babel-plugin-transform-runtime babel-preset-env babel-preset-react --save-dev
  ```
  
3、修改package.json文件

```
  "scripts": {
    "start": "NO_PROXY=true roadhog server",
    "build": "NODE_ENV=production roadhog build",
    "lint": "eslint --ext .js src test",
    "precommit": "npm run lint"
  },
```
  
### 目录结构

  ```
  dist                          打包目录
  
  public                        公共资源
  
  src                           react代码
  
    ├—— assets                  图片等资源
      
    ├—— common                  自定义导航
      
    ├—— components              自定义组件
      
    ├—— layouts                 布局组件，嵌套路由
      
    ├—— models                  数据模型
      
    ├—— routes                  路由页面
      
    ├—— theme                   主题配置
    
    ├—— utils                   工具库
      
    ├—— index.js                项目入口
      
    └—— router.js               路由配置
    
  .webpackrc                    自动化配置
  ```
  
### 项目打包

1、配置.webpackrc

重命名 .webpackrc -> .webpackrc.js

修改  .webpackrc.js

  ```
  import { ENV } from './src/utils/utils';
  const packageInfo = require('./package.json');
  
  export default {
    "entry": "src/index.js",
    "publicPath": "/",
    "hash": true,
    "ignoreMomentLocale": true,
    "extraBabelPlugins": [
      ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
      ["module-resolver", {
        "root": ["./src"],
        "alias": { "~": "./src" }
      }]
    ],
    "env": {
      "development": {
        "extraBabelPlugins": [
          "dva-hmr"
        ]
      }
    },
    "html": {
      "template": "./src/index.ejs",
      "title": ENV.hometitle,
      "keywords": ENV.keywords,
      "description": ENV.description,
      "author": ENV.author,
      "verification": ENV.verification,
    },
    "browserslist": [
      "> 1%",
      "last 2 versions"
    ],
    "proxy": {
      "/api": {
        "target": "http://localhost:8080/",
          "changeOrigin": true,
          "pathRewrite": { "^/api" : "" }
      }
    }
  }

  ```
  
2、配置模版
  
删除 public/index.html

添加 src/index.ejs

  ```
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <meta name="keywords" content="<%= htmlWebpackPlugin.options.keywords %>" />
  <meta name="description" content="<%= htmlWebpackPlugin.options.description %>" />
  <meta name="Author" content="<%= htmlWebpackPlugin.options.author %>" />
  <meta name="Owner" content="<%= htmlWebpackPlugin.options.author %>" />
  <meta name="baidu-site-verification" content="<%= htmlWebpackPlugin.options.verification %>" />
  <link rel="icon" href="/favicon.png" type="image/x-icon">
  <!--[if lte IE 9]><script>window.onload=function(){alert('你的浏览器版本过低，为了更好的体验网站的系列服务，建议升级您的浏览器到ie10+');}</script><![endif]-->
  </head>
  <body>
  <div id="root"></div>
  </body>
  </html>
  ```

### 路由配置

1、添加 common/nav

配置路由数组，并利用dynamic实现动态加载组件

  ```
  import dynamic from 'dva/dynamic';
  
  const dynamicWrapper = (app, models, component) => dynamic({
    app,
    models: () => models.map(m => import(`../models/${m}.js`)),
    component,
  });
  ```

2、添加 routes/**

新建若干路由页面，文件名与common/nav中的调用名称一致
  
3、添加 utils/utils

添加循环导航数组方法
  
  ```
  export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach(node => {
      const item = node;
      item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      item.exact = true;
      if (item.children && !item.component) {
        arr.push(...getPlainNode(item.children, item.path));
      } else {
        if (item.children && item.component) {
          item.exact = false;
        }
        arr.push(item);
      }
    });
    return arr;
  }
  ```
  
4、修改 router.js

修改路由配置函数，实现对布局组件的加载

  ```
  import { getPlainNode } from '~/utils/utils';

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
  ```
    
5、layouts/BaseLayout、UserLayout

**导入相关依赖**

  ```
  import React from 'react';
  import { Route, Switch } from 'dva/router';
  import { Layout, BackTop } from 'antd';
  import { ENV } from '~/utils/utils';
  import DocumentTitle from 'react-document-title';
  import NotFound from "~/routes/Other/404";
  ```

**导入公共组件**

  ```
  import GlobalHeader from '~/components/Common/GlobalHeader';
  import GlobalFooter from '~/components/Common/GlobalFooter';
  import GlobalContent from '~/components/Common/GlobalContent';
  ```
    
**组织页面布局**

  ```
  const layout = (
    <Layout>
      <GlobalHeader navData={navData[0].children} location={location} dispatch={dispatch}/>

      <GlobalContent>

        <BackTop />
      </GlobalContent>

      <GlobalFooter/>
    </Layout>
  );
  ```

**循环路由组件**

  ```
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

  <GlobalContent>
    <Switch>
      {
        getRouteData('BaseLayout').map(item =>
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
      <Route component={NotFound} />
    </Switch>
    <BackTop />
  </GlobalContent>
  ```
  
**渲染布局组件**

  ```
  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let path = '/' + pathname.split('/')[1];
    let title = ENV.appname;
    getRouteData('BaseLayout').forEach((item) => {
      if (item.path !== '/' && item.path === path) {
        title = item.name + ' - ' + ENV.appname;
      }
    });
    return title;
  }

  return(
    <DocumentTitle title={this.getPageTitle()}>
      {layout}
    </DocumentTitle>
  )
  ```
  
### 本地存储

在 utils/utils.ENV 中添加配置

metuIndex-token ————  用户登录后保存token

metuIndex-currentMenu ————  记录MainMenu导航当前激活的key,用于F5刷新页面时显示默认的路由

### 疑难问题


  
