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
        name: 'Demo',
        id: 'doc.demo',
        key: 'demo',
        path: 'doc/demo',
        component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
      },
      {
        name: '介绍',
        id: 'doc.introduce',
        key: 'introduce',
        path: 'doc/introduce',
        component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
      },
      {
        name: '组件',
        id: 'doc.components',
        key: 'components',
        path: 'doc/components',
        component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
      },
    ],
  },
];

export default DocRoutes
