import dynamic from 'dva/dynamic';
import {FormattedMessage} from 'react-intl';

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
        component: dynamicWrapper(app, [], () => import('../routes/Home/Home')),
      },
      {
        name: '影像',
        id: 'menu.vision',
        key: 'vision',
        path: 'vision',
        component: dynamicWrapper(app, [], () => import('../routes/Vision/Vision')),
      },
      {
        name: '影像',
        id: 'menu.vision',
        key: 'vision-keyword',
        path: 'vision/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Vision/Vision')),
      },
      {
        name: '教程',
        id: 'menu.course',
        key: 'course',
        path: 'course',
        component: dynamicWrapper(app, [], () => import('../routes/Course/Course')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments',
        path: 'equipments',
        component: dynamicWrapper(app, [], () => import('../routes/Equipments/Equipments')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments-list',
        path: 'equipments/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Equipments/Equipments')),
      },

      {
        name: '照片集',
        id: 'menu.photos',
        key: 'photos',
        path: 'photos/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Photo/PhotosDetail')),
      },
      {
        name: '照片',
        id: 'menu.photo',
        key: 'photo',
        path: 'photo/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, ['photo'], () => import('../routes/Photo/PhotoDetail')),
      },
      {
        name: '文章详情',
        id: 'menu.article.detail',
        key: 'article',
        path: 'course/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Article/ArticleDetail')),
      },

      {
        name: '标签云',
        id: 'menu.tags',
        key: 'tags',
        path: 'tags',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Tags/TagsExport')),
      },
      {
        name: '标签',
        id: 'menu.tag',
        key: 'tag',
        path: 'tags/:tag',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Tags/TagsArticle')),
      },
      {
        name: '用户中心',
        id: 'menu.user.center',
        key: 'center',
        path: 'u/:username',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../routes/Account/AccountCenter')),
      },
      {
        name: '用户设置',
        id: 'menu.user.setting',
        key: 'setting',
        path: 'setting',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../routes/Account/AccountSetting')),
      },
      {
        name: '发布',
        id: 'menu.publish',
        key: 'publish',
        path: 'publish/:publishType',
        isHide: true,
        component: dynamicWrapper(app, ['oss', 'publish'], () => import('../routes/Publish/Publish')),
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
            id: 'callback.wechat',
            key: 'wechat',
            path: 'wechat',
            component: dynamicWrapper(app, [], () => import('../routes/Callback/Wechat')),
          },
          {
            name: '微博回调',
            id: 'callback.weibo',
            key: 'weibo',
            path: 'weibo',
            component: dynamicWrapper(app, [], () => import('../routes/Callback/Weibo')),
          },
          {
            name: 'QQ回调',
            id: 'callback.qq',
            key: 'qq',
            path: 'qq',
            component: dynamicWrapper(app, [], () => import('../routes/Callback/Qq')),
          },
        ]
      },

      {
        name: '活动专区',
        id: 'hdzq',
        key: 'hdzq',
        path: 'hdzq',
        isHide: true,
        children: [
          {
            name: '幸运抽奖',
            id: 'hdzq.lucky',
            key: 'lucky',
            path: 'lucky',
            component: dynamicWrapper(app, [], () => import('../routes/Hdzq/Lucky')),
          },
        ]
      },
    ]
  },

];

export default BaseRoutes;
