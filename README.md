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
    
    ├—— blocks                  通用模块 - 组件综合使用
      
    ├—— components              通用组件
    
    ├—— containers              页面组件
      
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
  import { getPlainNode } from '@/utils/utils';

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
  import { ENV } from '@/utils/utils';
  import DocumentTitle from 'react-document-title';
  import NotFound from "@/pages/Other/404";
  ```

**导入公共组件**

  ```
  import GlobalHeader from '@/components/Common/GlobalHeader';
  import GlobalFooter from '@/components/Common/GlobalFooter';
  import GlobalContent from '@/components/Common/GlobalContent';
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

#### 微信授权登录

1. 前端获取code

前端页面导入组件 import WxLogin from 'wxlogin.react';

用户扫码WxLogin组件生成的二维码，进入回调页面，

回调页面截取链接code，传给后端。

```
<WxLogin
  option={{
    appid: WechatConfig.AppId,
    userServiceAPI: WechatConfig.redirect_uri,
    scope: WechatConfig.scope,
    state: WechatLoginState,
    userServiceParams: {
      from: 'pc',
      flag: 'signin',
      type: 'weixin',
      env: 'development',
      uid: '',
    },
    smartRedirect: '',
    href: '',  // 'data:text/css;base64,' + Base64.encode('./UserWechatLoginHref.css')
  }}
  style={{
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    textAlign: 'center'
  }}
/>
```

2. 后端查询access_token

```
function getAccessToken(code, cb){
	var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?';

	var params = {
		grant_type: 'authorization_code',
		appid: config.AppId,
		secret: config.AppSecret,
		code: code,
    };
    for (let i in params) {
		url += (i + '=' + encodeURIComponent(params[i]) + '&');
	}

	url = url.substring(0, url.lastIndexOf('&'));
	request.get(
		url,
		function(error, response, body){
		    if(!error && response.statusCode === 200){
				var data = JSON.parse(body);
		    	if(data.errcode){
		    		cb({status: 0, msg: data.errcode})						// code过期
		    	}else{
		    		cb({status: 1, msg:'成功', data: data})
		    	}
	          
	      }
		}
	)
}
```

3. 后端查询wechat_userinfo

##### 参考：

[react之网页获取微信用户信息](https://www.jianshu.com/p/0a35c647cbb3)

[从 40029 和 state 来说说微信网页授权的安全问题](https://blog.csdn.net/weixin_37242696/article/details/80243325)
  
[微信授权登录并获取用户信息接口开发](http://www.cnblogs.com/it-cen/p/4568278.html)

##### 说明:

state机制

1) 登入页面生成state随机值，传入code查询链接，并保存至Storage。

```
const state = Encrypt('wechatlogin', ('xxxxxx' + Math.random()));

Storage.set(ENV.storageWechatLoginState, state);
```

2) 回调页面截取链接中的state，并与本地存储中的state进行比较。

```
let state = paramsObj.state;
if(!state || state !== Storage.get(ENV.storageWechatLoginState)){
  return;
}
```

3) 链接附带非法state的请求将会被拦截。

#### QQ授权登录

1. 前端获取code

打开新窗口，截取链接中的code，传给后端

```
qqLogin = () => {
  const QqLoginState = Encrypt('Qqlogin', ('metuwang' + Math.random()));
  Storage.set(ENV.storageQqLoginState, QqLoginState);

  let url = 'https://graph.qq.com/oauth2.0/authorize?';
  let params = {
    response_type: 'code',
    client_id: '101551625',
    redirect_uri: encodeURI('http://www.metuwang.com/callback/qqLogin'),
    state: QqLoginState
  };
  for (let i in params) {
    url += (i + '=' + params[i] + '&');
  }
  url = url.substring(0, url.lastIndexOf('&'));
  window.location.href = url;
};
```

2. 后端查询access_token

```
function getAccessToken(code, cb){
	var url = 'https://graph.qq.com/oauth2.0/token?';

	var params = {
		grant_type: 'authorization_code',
		client_id: config.AppId,
		client_secret: config.AppKey,
		code: code,
		redirect_uri: encodeURI(config.redirect_uri),
    };
    for (let i in params) {
		url += (i + '=' + encodeURIComponent(params[i]) + '&');
	}

	url = url.substring(0, url.lastIndexOf('&'));
	request.get(
		url,
		function(error, response, body){
		    if(!error && response.statusCode === 200){
		    	var access_token = body.split('&')[0].split('=')[1];
		    	if(!access_token){
		    		cb({status: 0, msg: '获取access_token失败'})						// code过期
		    	}else{
		    		cb({status: 1, msg:'成功', data: access_token})
		    	}
	          
	      }
		}
	)
}
```

3. 后端查询openid

```
function getOpenid(access_token, cb){
	
	var url = 'https://graph.qq.com/oauth2.0/me?access_token=' + access_token;
	request.get(
		url,
		function(error, response, body){
		    if(!error && response.statusCode === 200){
		    	// callback( {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"} ); 
		    	var json = JSON.parse(body.split('(')[1].split(')')[0])
		    	if(!json.openid){
		    		cb({status: 0, msg: '获取openid失败'})						// access_token失效
		    	}else{
		    		cb({status: 1, msg:'成功', data: json.openid})
		    	}
	          
	      }
		}
	)
}
```

4. 后端查询qq_uderinfo


#### 微博授权登录

1. 前端获取code

```
weiboLogin = () => {
  const WeiboLoginState = Encrypt('Weibologin', ('metuwang' + Math.random()));
  Storage.set(ENV.storageWeiboLoginState, WeiboLoginState);

  let url = 'https://api.weibo.com/oauth2/authorize?';
  let params = {
    response_type: 'code',
    client_id: '1779469029',
    redirect_uri: encodeURI('http://www.metuwang.com/callback/weiboLogin'),
    state: WeiboLoginState
  };
  for (let i in params) {
    url += (i + '=' + params[i] + '&');
  }
  url = url.substring(0, url.lastIndexOf('&'));
  window.location.href = url;
};
```

2. 后端查询access_token

```
function getAccessToken(code, cb){

	var url = 'https://api.weibo.com/oauth2/access_token?';

	var params = {
		grant_type: 'authorization_code',
		client_id: config.AppId,
		client_secret: config.AppSecret,
		code: code,
		redirect_uri: encodeURI(config.redirect_uri),
    };

    request.post(
    	{
    		url: url, 
    		form: params
    	}, 
    	function (error ,response, body) {
    		var data = JSON.parse(body);
  			if(!error && response.statusCode === 200){

		    	if(!data.access_token){
		    		cb({status: 0, msg: '获取access_token失败'})						// code过期
		    	}else{
		    		cb({status: 1, msg:'成功', data: data})
		    	}
	          
			}else{
				cb({status: 0, msg: '获取access_token失败'})
			}
		}
	)
}
```

3. 后端查询用户信息weibo_userinfo
