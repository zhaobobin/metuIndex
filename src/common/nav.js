import dynamic from 'dva/dynamic';
import {FormattedMessage} from 'react-intl';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [

  {
    component: dynamicWrapper(app, [], () => import('../layouts/BaseLayout')),
    layout: 'BaseLayout',
    key: 'MainMenu',
    name: '基本布局',
    path: '/',
    children: [
      {
        name: <FormattedMessage id="menu.home"/>,
        key: 'home',
        path: '',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../routes/Home/Home')),
      },
      {
        name: <FormattedMessage id="menu.vision"/>,
        key: 'vision',
        path: 'vision',
        component: dynamicWrapper(app, [], () => import('../routes/Vision/Vision')),
      },
      {
        name: <FormattedMessage id="menu.vision"/>,
        key: 'vision-keyword',
        path: 'vision/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Vision/Vision')),
      },
      {
        name: <FormattedMessage id="menu.course"/>,
        key: 'course',
        path: 'course',
        component: dynamicWrapper(app, [], () => import('../routes/Course/Course')),
      },
      {
        name: <FormattedMessage id="menu.equipments"/>,
        key: 'equipments',
        path: 'equipments',
        component: dynamicWrapper(app, [], () => import('../routes/Equipments/Equipments')),
      },
      {
        name: <FormattedMessage id="menu.equipments"/>,
        key: 'equipments-list',
        path: 'equipments/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Equipments/Equipments')),
      },

      {
        name: <FormattedMessage id="menu.photos"/>,
        path: 'photos/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Photo/PhotosDetail')),
      },
      {
        name: <FormattedMessage id="menu.photo"/>,
        path: 'photo/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, ['photo'], () => import('../routes/Photo/PhotoDetail')),
      },
      {
        name: <FormattedMessage id="menu.article.detail"/>,
        path: 'course/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Article/ArticleDetail')),
      },

      {
        name: <FormattedMessage id="menu.tags"/>,
        path: 'tags',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Tags/TagsExport')),
      },
      {
        name: <FormattedMessage id="menu.tag"/>,
        path: 'tags/:tag',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Tags/TagsArticle')),
      },
      {
        name: <FormattedMessage id="menu.user.center"/>,
        path: 'u/:username',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../routes/Account/AccountCenter')),
      },
      {
        name: <FormattedMessage id="menu.user.setting"/>,
        path: 'setting',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../routes/Account/AccountSetting')),
      },
      {
        name: <FormattedMessage id="menu.publish"/>,
        key: 'publish',
        path: 'publish/:publishType',
        isHide: true,
        component: dynamicWrapper(app, ['oss', 'publish'], () => import('../routes/Publish/Publish')),
      },
    ]
  },

  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    layout: 'UserLayout',
    key: 'UserMenu',
    name: '用户',
    path: 'user',
    children: [
      {
        name: <FormattedMessage id="menu.user.login"/>,
        icon: 'user',
        path: 'user/login',
        component: dynamicWrapper(app, [], () => import('../routes/User/Login')),
      },
      {
        name: <FormattedMessage id="menu.user.register"/>,
        icon: 'user',
        path: 'user/register',
        component: dynamicWrapper(app, [], () => import('../routes/User/Register')),
      },
      {
        name: <FormattedMessage id="menu.user.reset"/>,
        icon: 'user',
        path: 'user/reset',
        component: dynamicWrapper(app, [], () => import('../routes/User/Reset')),
      },
    ],
  },
];
