import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

const DocRoutes = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/DocLayout')),
    layout: 'DocLayout',
    key: 'DocMenu',
    name: '用户',
    path: 'doc',
    children: [
      {
        name: '按钮',
        key: 'common',
        path: 'doc/button',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../routes/Doc/Button')),
      },
      {
        name: 'UI',
        key: 'common',
        path: 'doc/ui',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../routes/Doc/UI')),
      },
    ],
  },
];

export default DocRoutes
