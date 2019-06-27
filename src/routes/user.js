import dynamic from 'dva/dynamic';
// import {FormattedMessage} from 'react-intl';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
const UserRoutes = app => [

  //用户路由
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    layout: 'UserLayout',
    key: 'UserMenu',
    name: '用户',
    path: 'user',
    children: [
      {
        name: '用户登录',
        id: 'menu.user.login',
        icon: 'user',
        path: 'user/login',
        component: dynamicWrapper(app, [], () => import('../pages/User/Login')),
      },
      {
        name: '用户注册',
        id: 'menu.user.register',
        icon: 'user',
        path: 'user/register',
        component: dynamicWrapper(app, [], () => import('../pages/User/Register')),
      },
      {
        name: '找回密码',
        id: 'menu.user.reset',
        icon: 'user',
        path: 'user/reset/:step',
        component: dynamicWrapper(app, [], () => import('../pages/User/Reset')),
      },
    ],
  },
];

export default UserRoutes;
