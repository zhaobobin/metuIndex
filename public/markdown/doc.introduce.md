<div align="center">
  <a href="https://www.metuwang.com/" target="_blank" rel="noopener noreferrer nofollow">
    <img src="http://www.metuwang.com/favicon.png" width="auto" height="32px" alt="去投网logo" />
    <strong style="color: #333; font-size: 28px; line-height: 32px; position: relative; left: 5px; top: 6px">迷图网</strong>
  </a>
</div>

## 介绍

迷图网(www.metuwang.com)，是一个致力于摄影分享、发现、售卖的专业平台，来自世界各地的摄影师是我们忠实的用户。让你与他人因图片相识，世界那么大，我想去看看。


## 指南

- [区块](/doc/blocks)

  * [用户登录](/doc/blocks/user/login)
  
  * [用户注册](/doc/blocks/user/register)

- [组件](/doc/components)

- [工具](/doc/utils)

- [模型](/doc/model)


## 结构

```
  
  dist                          打包目录
  
  public                        公共资源
    ├—— css
    ├—— images
    ├—— markdown
    
  src                           react代码
    ├—— assets                  图片等资源
    ├—— common                  自定义导航
    
    ├—— blocks                  通用模块 - 组件综合使用
    ├—— components              通用组件
    ├—— containers              页面组件
    ├—— layouts                 布局组件，嵌套路由
    ├—— locales                 国际化配置
      
    ├—— models                  数据模型
    ├—— pages                   页面文件
    ├—— routes                  路由配置
    ├—— theme                   主题配置
    ├—— utils                   工具库
    ├—— index.js                项目入口
    └—— index.ejs               模版文件
    
  .webpackrc                    自动化配置
  
  ```


## 配置

```
{

  api: {
    test: 'http://localhost:8080/',
    pro: 'http://www.metuwang.com/',
  },

  appname: '迷图网',
  hometitle: '迷图网 - 摄影图片素材分享社区',
  keywords: '迷图网,摄影,图片,素材,分享,社区。',
  description: '迷图网(www.metuwang.com)，是一个致力于摄影分享、发现、售卖的专业平台，来自世界各地的摄影师是我们忠实的用户。让你与他人因图片相识，世界那么大，我想去看看。',
  author: '迷图网(www.metuwang.com)',
  verification: '',

  address: '',
  hotline: '',
  email: '',
  icp: 'ICP经营许可证 京B2-20160180',
  beian: '京ICP备16058155号-1',
  copyright: '©2015-2018 迷图网 All rights reserved',
  slogan: '影像点亮生活',
  web: 'www.metuwang.com',
  worktime: '9:00-17:30',

  storageToken: 'metuIndex-token',
  storageLastTel: 'metuIndex-lastTel',
  storageRemenber: 'metuIndex-remenber',
  storageHistory: 'metuIndex-history',
  storageTheme: 'metuIndex-theme',
  storageCurrentMenu: 'metuIndex-currentMenu',

  storageWechatLoginState: 'metuIndex-WechatLoginState',    // 微信授权登录state
  storageWeiboLoginState: 'metuIndex-WeiboLoginState',    // 微博授权登录state
  storageQqLoginState: 'metuIndex-QqLoginState',    // QQ授权登录state

}
```


