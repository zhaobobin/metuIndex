import dynamic from 'dva/dynamic';

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
    name: '前台',
    path: '/',
    children: [
      {
        name: '首页',
        key: 'home',
        path: '',
        component: dynamicWrapper(app, [], () => import('../routes/Home/Home')),
      },
      {
        name: '影像',
        key: 'vision',
        path: 'vision',
        component: dynamicWrapper(app, [], () => import('../routes/Vision/Vision')),
      },
      {
        name: '影像-分类',
        key: 'vision-category',
        path: 'vision/:category',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../routes/Vision/Vision')),
      },
      {
        name: '教程',
        key: 'course',
        path: 'course',
        component: dynamicWrapper(app, [], () => import('../routes/Course/Course')),
      },
      // {
      //   name: '器材',
      //   key: 'equipments',
      //   path: 'equipments',
      //   component: dynamicWrapper(app, ['equipments'], () => import('../routes/Equipments/Equipments')),
      // },
      // {
      //   name: '器材列表',
      //   key: 'equipments-list',
      //   path: 'equipments/:keyword',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['equipments'], () => import('../routes/Equipments/Equipments')),
      // },
      //
      // {
      //   name: '相册详情',
      //   path: 'album/:id/:title',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['comment'], () => import('../routes/Photo/AlbumDetail')),
      // },
      // {
      //   name: '图片详情',
      //   path: 'photo/:id/:title',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['photo', 'comment'], () => import('../routes/Photo/PhotoDetail')),
      // },
      // {
      //   name: '文章详情',
      //   path: ':category/:id/:title',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['comment'], () => import('../routes/Article/ArticleDetail')),
      // },
      //
      // {
      //   name: '标签云',
      //   path: '/tags',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['tags'], () => import('../routes/Tags/TagsExport')),
      // },
      // {
      //   name: '标签',
      //   path: '/tags/:tag',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['tags'], () => import('../routes/Tags/TagsArticle')),
      // },
      {
        name: '用户中心',
        path: 'u/:username',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../routes/User/UserCenter')),
      },
      // {
      //   name: '设置',
      //   path: 'setting',
      //   isHide: true,
      //   component: dynamicWrapper(app, ['oss'], () => import('../routes/User/UserSetting')),
      // },
      {
        name: '发布',
        path: 'publish/:modelType',
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
        name: '用户登录',
        icon: 'user',
        path: 'user/login',
        component: dynamicWrapper(app, [], () => import('../routes/User/Login')),
      },
      {
        name: '用户注册',
        icon: 'user',
        path: 'user/register',
        component: dynamicWrapper(app, [], () => import('../routes/User/Register')),
      },
      {
        name: '忘记密码',
        icon: 'user',
        path: 'user/reset',
        component: dynamicWrapper(app, [], () => import('../routes/User/Reset')),
      },
    ],
  },
];
