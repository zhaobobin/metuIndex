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
        name: '圈子',
        id: 'menu.cricle',
        key: 'cricle',
        path: 'cricle',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Discover/Cricle')),
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
        name: '账户中心',
        id: 'menu.users',
        key: 'users',
        path: 'users/:username',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/_layout')),
        children: [
          {
            name: '图片',
            id: 'menu.users.photos',
            key: 'photos',
            path: 'photos',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountPhotos')),
          },
          {
            name: '文章',
            id: 'menu.users.articles',
            key: 'articles',
            path: 'articles',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountArticles')),
          },
          {
            name: '关注',
            id: 'menu.users.following',
            key: 'following',
            path: 'following',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountFollowing')),
          },
          {
            name: '点赞',
            id: 'menu.users.favoring',
            key: 'favoring',
            path: 'favoring',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountFavoring')),
          },
          {
            name: '收藏',
            id: 'menu.users.collecting',
            key: 'collecting',
            path: 'collecting',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountCollecting')),
          },
          {
            name: '简介',
            id: 'menu.users.detail',
            key: 'detail',
            path: 'detail',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountDetail')),
          },
          {
            name: '编辑个人资料',
            id: 'menu.account.edit',
            key: 'edit',
            path: 'edit',
            isHide: true,
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountEdit')),
          },
        ]
      },
      {
        name: '用户设置',
        id: 'menu.user.settings',
        key: 'settings',
        path: 'settings',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Settings/_layout')),
        children: [
          {
            name: '帐号绑定',
            id: 'menu.user.settings.bind',
            key: 'bind',
            path: 'bind',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsBind')),
          },
          {
            name: '个人信息',
            id: 'menu.user.settings.profile',
            key: 'profile',
            path: 'profile',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsProfile')),
          },
        ]
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
