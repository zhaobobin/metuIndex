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
        children: [
          {
            name: '表单',
            id: 'doc.components.form',
            key: 'components-form',
            path: 'form',
            component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
          }
        ]
      },
      {
        name: '模型',
        id: 'doc.model',
        key: 'model',
        path: 'doc/model',
        children: [
          {
            name: '图片',
            id: 'doc.model.photo',
            key: 'model-photo',
            path: 'photo',
            component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
          }
        ]
      },
    ],
  },
];

export default DocRoutes
