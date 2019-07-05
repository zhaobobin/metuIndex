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
        name: '区块',
        id: 'doc.blocks',
        key: 'blocks',
        path: 'doc/blocks',
        children: [
          {
            name: '用户',
            id: 'doc.user',
            key: 'user',
            path: 'user',
            children: [
              {
                name: '登录',
                id: 'doc.blocks.user.login',
                key: 'blocks-user-login',
                path: 'login',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
              {
                name: '注册',
                id: 'doc.blocks.user.register',
                key: 'blocks-user-register',
                path: 'register',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
            ]
          }
        ]
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
            children: [
              {
                name: '文本',
                id: 'doc.components.form.text',
                key: 'components-form-text',
                path: 'text',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
              {
                name: '手机号',
                id: 'doc.components.form.mobile',
                key: 'components-form-mobile',
                path: 'mobile',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
              {
                name: '密码',
                id: 'doc.components.form.password',
                key: 'components-form-password',
                path: 'password',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
              {
                name: '短信验证',
                id: 'doc.components.form.smscode',
                key: 'components-form-smscode',
                path: 'smscode',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
              {
                name: '邮箱',
                id: 'doc.components.form.email',
                key: 'components-form-email',
                path: 'email',
                component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
              },
            ]
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
            name: '用户',
            id: 'doc.model.user',
            key: 'model-user',
            path: 'user',
            component: dynamicWrapper(app, [], () => import('../pages/Doc/Doc')),
          },
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
