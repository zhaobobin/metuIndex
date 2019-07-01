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

      // 内容
      {
        name: '社区',
        id: 'menu.community',
        key: 'community',
        path: 'community',
        component: dynamicWrapper(app, [], () => import('../pages/Content/Community')),
      },
      {
        name: '社区',
        id: 'menu.community',
        key: 'community-keyword',
        path: 'community/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/Community')),
      },
      {
        name: '照片集',
        id: 'menu.photos',
        key: 'photos',
        path: 'photos/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Content/PhotosDetail')),
      },
      {
        name: '照片',
        id: 'menu.photo',
        key: 'photo',
        path: 'photo/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Content/PhotoDetail')),
      },
      {
        name: '文章详情',
        id: 'menu.article.detail',
        key: 'article',
        path: 'course/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/ArticleDetail')),
      },
      {
        name: '活动',
        id: 'menu.contest',
        key: 'contest',
        path: 'contest',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/Contest')),
      },

      // 发现
      {
        name: '摄影师',
        id: 'menu.author',
        key: 'author',
        path: 'author',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Discover/Author')),
      },
      {
        name: '部落',
        id: 'menu.tribe',
        key: 'tribe',
        path: 'tribe',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Discover/Tribe')),
      },
      {
        name: '教程',
        id: 'menu.course',
        key: 'course',
        path: 'course',
        component: dynamicWrapper(app, [], () => import('../pages/Discover/Course')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments',
        path: 'equipments',
        component: dynamicWrapper(app, [], () => import('../pages/Discover/Equipments')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments-list',
        path: 'equipments/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Discover/Equipments')),
      },
      {
        name: '标签云',
        id: 'menu.tags',
        key: 'tags',
        path: 'tags',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Discover/TagsExport')),
      },
      {
        name: '标签',
        id: 'menu.tag',
        key: 'tag',
        path: 'tags/:tag',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Discover/TagsArticle')),
      },

      // 账户
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
        component: dynamicWrapper(app, ['oss', 'publish'], () => import('../pages/Account/Publish')),
      },

      // 第三方
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

      // 其他
      {
        name: '帮助中心',
        id: 'menu.help',
        key: 'help',
        path: 'help',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Help')),
      },
      {
        name: '服务条款',
        id: 'menu.service',
        key: 'service',
        path: 'service',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Service')),
      },
      {
        name: '联系我们',
        id: 'menu.contact',
        key: 'contact',
        path: 'contact',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Contact')),
      },
      {
        name: '网站地图',
        id: 'menu.sitemap',
        key: 'sitemap',
        path: 'sitemap',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Sitemap')),
      },

    ]
  },

];

export default BaseRoutes;
