import dynamic from 'dva/dynamic';
// import {FormattedMessage} from 'react-intl';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
const BaseRoutes = app => [

  //基本路由
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BaseLayout')),
    layout: 'BaseLayout',
    key: 'MainMenu',
    name: '基本布局',
    path: '/',
    children: [
      {
        name: '首页',
        id: 'menu.home',
        key: 'home',
        path: '',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../pages/Home/Home')),
      },
      {
        name: '影像',
        id: 'menu.vision',
        key: 'vision',
        path: 'vision',
        component: dynamicWrapper(app, [], () => import('../pages/Vision/Vision')),
      },
      {
        name: '影像',
        id: 'menu.vision',
        key: 'vision-keyword',
        path: 'vision/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Vision/Vision')),
      },
      {
        name: '教程',
        id: 'menu.course',
        key: 'course',
        path: 'course',
        component: dynamicWrapper(app, [], () => import('../pages/Course/Course')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments',
        path: 'equipments',
        component: dynamicWrapper(app, [], () => import('../pages/Equipments/Equipments')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments-list',
        path: 'equipments/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Equipments/Equipments')),
      },

      {
        name: '照片集',
        id: 'menu.photos',
        key: 'photos',
        path: 'photos/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Vision/PhotosDetail')),
      },
      {
        name: '照片',
        id: 'menu.photo',
        key: 'photo',
        path: 'photo/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, ['photo'], () => import('../pages/Vision/PhotoDetail')),
      },
      {
        name: '文章详情',
        id: 'menu.article.detail',
        key: 'article',
        path: 'course/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Article/ArticleDetail')),
      },

      {
        name: '标签云',
        id: 'menu.tags',
        key: 'tags',
        path: 'tags',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Tags/TagsExport')),
      },
      {
        name: '标签',
        id: 'menu.tag',
        key: 'tag',
        path: 'tags/:tag',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Tags/TagsArticle')),
      },
      {
        name: '用户中心',
        id: 'menu.user.center',
        key: 'center',
        path: 'u/:username',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountCenter')),
      },
      {
        name: '用户设置',
        id: 'menu.user.setting',
        key: 'setting',
        path: 'setting',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountSetting')),
      },
      {
        name: '发布',
        id: 'menu.publish',
        key: 'publish',
        path: 'publish/:publishType',
        isHide: true,
        component: dynamicWrapper(app, ['oss', 'publish'], () => import('../pages/Publish/Publish')),
      },
      {
        name: '回调',
        id: 'calback',
        key: 'callback',
        path: 'callback',
        isHide: true,
        children: [
          {
            name: '微信回调',
            id: 'callback.wechat.login',
            key: 'wechatLogin',
            path: 'wechatLogin',
            component: dynamicWrapper(app, [], () => import('../pages/Callback/WechatLogin')),
          },
          {
            name: '微博回调',
            id: 'callback.weibo.login',
            key: 'weiboLogin',
            path: 'weiboLogin',
            component: dynamicWrapper(app, [], () => import('../pages/Callback/WeiboLogin')),
          },
          {
            name: 'QQ回调',
            id: 'callback.qq.login',
            key: 'qqLogin',
            path: 'qqLogin',
            component: dynamicWrapper(app, [], () => import('../pages/Callback/QqLogin.js')),
          },
        ]
      },

    ]
  },

];

export default BaseRoutes;
