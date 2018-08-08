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
        name: '我要出借',
        key: 'lend',
        path: 'lend',
        children: [
          {
            name: '活动专区',
            key: 'hdzq',
            path: 'hdzq',
            component: dynamicWrapper(app, [], () => import('../routes/Lend/Hdzq')),
          },
          {
            name: '散标专区',
            key: 'sbzq',
            path: 'sbzq',
            component: dynamicWrapper(app, [], () => import('../routes/Lend/Sbzq')),
          },
          {
            name: '变现专区',
            key: 'bxzq',
            path: 'bxzq',
            component: dynamicWrapper(app, [], () => import('../routes/Lend/Bxzq')),
          },
        ]
      },
      {
        name: '我要借款',
        key: 'borrow',
        path: 'borrow',
        component: dynamicWrapper(app, [], () => import('../routes/Borrow/Borrow')),
      },
      {
        name: '新手须知',
        key: 'guide',
        path: 'guide',
        children: [
          {
            name: '新手须知',
            key: 'notes',
            path: 'notes',
            component: dynamicWrapper(app, [], () => import('../routes/Guide/Notes')),
          },
          {
            name: '风险控制',
            key: 'control',
            path: 'control',
            component: dynamicWrapper(app, [], () => import('../routes/Guide/RiskControl')),
          },
          {
            name: '收费标准',
            key: 'standard',
            path: 'standard',
            component: dynamicWrapper(app, [], () => import('../routes/Guide/ChargeStandard')),
          },
          {
            name: '常见问题',
            key: 'problem',
            path: 'problem',
            component: dynamicWrapper(app, [], () => import('../routes/Guide/Problem')),
          },
        ]
      },
      {
        name: '信息披露',
        key: 'information',
        path: 'information',
        children: [
          {
            name: '借贷课堂',
            key: 'classroom',
            path: 'classroom',
            component: dynamicWrapper(app, [], () => import('../routes/Information/Classroom')),
          },
        ]
      },
      {
        name: '关于我们',
        key: 'about',
        path: 'about',
        component: dynamicWrapper(app, [], () => import('../routes/About/About')),
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
