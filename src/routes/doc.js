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
    name: '开发文档',
    id: 'doc',
    path: 'doc',
    children: [
      {
        name: '按钮',
        id: 'doc.button',
        key: 'common',
        path: 'doc/button',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../pages/Doc/Button')),
      },
      {
        name: 'UI',
        id: 'doc.ui',
        key: 'common',
        path: 'doc/ui',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../pages/Doc/UI')),
      },
    ],
  },
];

export default DocRoutes
