import dynamic from 'dva/dynamic';
// import {FormattedMessage} from 'react-intl';

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
        component: dynamicWrapper(app, [], () => import('../pages/Home/Home')),
      },

      // 社区
      {
        name: '社区',
        id: 'menu.community',
        key: 'community',
        path: 'community',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Community/_layout')),
      },
      {
        name: '发现',
        id: 'menu.community.discover',
        key: 'discover',
        path: 'community/discover',
        component: dynamicWrapper(app, [], () => import('../pages/Community/Discover')),
      },
      {
        name: '摄影师',
        id: 'menu.community.author',
        key: 'author',
        path: 'community/author',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Community/Author')),
      },
      {
        name: '圈子',
        id: 'menu.community.cricle',
        key: 'cricle',
        path: 'community/cricle',
        component: dynamicWrapper(app, [], () => import('../pages/Community/Cricle')),
      },

      {
        name: '活动',
        id: 'menu.contest',
        key: 'contest',
        path: 'contest',
        component: dynamicWrapper(app, [], () => import('../pages/Contest/_layout')),
      },
      {
        name: '问答',
        id: 'menu.question',
        key: 'question',
        path: 'question',
        component: dynamicWrapper(app, ['question', 'publish'], () => import('../pages/Question/_layout')),
      },

      {
        name: '话题广场',
        id: 'menu.topics',
        key: 'topics',
        path: 'topics',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/Topics')),
      },
      {
        name: '话题',
        id: 'menu.topic',
        key: 'topic',
        path: 'topic',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/Topic')),
      },
      {
        name: '标签云',
        id: 'menu.tags',
        key: 'tags',
        path: 'tags',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/TagsExport')),
      },
      {
        name: '标签',
        id: 'menu.tag',
        key: 'tag',
        path: 'tags/:tag',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/TagsArticle')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments',
        path: 'equipments',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/Equipments')),
      },
      {
        name: '器材',
        id: 'menu.equipments',
        key: 'equipments-list',
        path: 'equipments/:keyword',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Content/Equipments')),
      },

      // 详情
      {
        name: '照片详情',
        id: 'menu.photo.detail',
        key: 'photo',
        path: 'photos/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Detail/PhotoDetail')),
      },
      {
        name: '图文详情',
        id: 'menu.article.detail',
        key: 'article',
        path: 'graphic/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Detail/ArticleDetail')),
      },
      {
        name: '问答详情',
        id: 'menu.question.detail',
        key: 'question',
        path: 'question/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Detail/QuestionDetail')),
      },
      {
        name: '话题详情',
        id: 'menu.topic.detail',
        key: 'topic',
        path: 'topic/:id/:title',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Detail/TopicDetail')),
      },

      // 账户
      {
        name: '账户中心',
        id: 'menu.users',
        key: 'users',
        path: 'users/:username',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/_layout')),
        children: [
          {
            name: '图片',
            id: 'menu.users.photos',
            key: 'photos',
            path: 'photos',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountPhotos')),
          },
          {
            name: '文章',
            id: 'menu.users.articles',
            key: 'articles',
            path: 'articles',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountArticles')),
          },
          {
            name: '关注',
            id: 'menu.users.following',
            key: 'following',
            path: 'following',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountFollowing')),
          },
          {
            name: '点赞',
            id: 'menu.users.favoring',
            key: 'favoring',
            path: 'favoring',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountFavoring')),
          },
          {
            name: '收藏',
            id: 'menu.users.collecting',
            key: 'collecting',
            path: 'collecting',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountCollecting')),
          },
          {
            name: '简介',
            id: 'menu.users.detail',
            key: 'detail',
            path: 'detail',
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountDetail')),
          },
          {
            name: '编辑个人资料',
            id: 'menu.account.edit',
            key: 'edit',
            path: 'edit',
            isHide: true,
            component: dynamicWrapper(app, ['oss'], () => import('../pages/Account/AccountEdit')),
          },
        ]
      },
      {
        name: '用户设置',
        id: 'menu.user.settings',
        key: 'settings',
        path: 'settings',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Settings/_layout')),
        children: [
          {
            name: '帐号绑定',
            id: 'menu.user.settings.bind',
            key: 'bind',
            path: 'bind',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsBind')),
          },
          {
            name: '个人信息',
            id: 'menu.user.settings.profile',
            key: 'profile',
            path: 'profile',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsProfile')),
          },
          {
            name: '消息提醒',
            id: 'menu.user.settings.message',
            key: 'message',
            path: 'message',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsMessage')),
          },
          {
            name: '偏好设置',
            id: 'menu.user.settings.preference',
            key: 'preference',
            path: 'preference',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsPreference')),
          },
          {
            name: '实名认证',
            id: 'menu.user.settings.authenticate',
            key: 'authenticate',
            path: 'authenticate',
            component: dynamicWrapper(app, [], () => import('../pages/Settings/SettingsAuthenticate')),
          },
        ]
      },

      {
        name: '消息中心',
        id: 'menu.user.messages',
        key: 'messages',
        path: 'messages',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Messages/_layout')),
        children: [
          {
            name: '点赞',
            id: 'menu.user.messages.favor',
            key: 'favor',
            path: 'favor',
            component: dynamicWrapper(app, [], () => import('../pages/Messages/MessagesFavor')),
          },
          {
            name: '评论',
            id: 'menu.user.messages.comment',
            key: 'comment',
            path: 'comment',
            component: dynamicWrapper(app, [], () => import('../pages/Messages/MessagesComment')),
          },
          {
            name: '关注',
            id: 'menu.user.messages.follow',
            key: 'follow',
            path: 'follow',
            component: dynamicWrapper(app, [], () => import('../pages/Messages/MessagesFollow')),
          },
          {
            name: '收藏',
            id: 'menu.user.messages.collect',
            key: 'collect',
            path: 'collect',
            component: dynamicWrapper(app, [], () => import('../pages/Messages/MessagesCollect')),
          },
          {
            name: '私信',
            id: 'menu.user.messages.mail',
            key: 'mail',
            path: 'mail',
            component: dynamicWrapper(app, [], () => import('../pages/Messages/MessagesMail')),
          },
          {
            name: '通知',
            id: 'menu.user.messages.notify',
            key: 'motify',
            path: 'notify',
            component: dynamicWrapper(app, [], () => import('../pages/Messages/MessagesNotify')),
          },
        ]
      },

      {
        name: '搜索结果',
        id: 'menu.search.result',
        key: 'search',
        path: 'search',
        isHide: true,
        component: dynamicWrapper(app, [], () => import('../pages/Search/_layout')),
      },

      {
        name: '发布',
        id: 'menu.publish',
        key: 'publish',
        path: 'publish/:publishType',
        isHide: true,
        component: dynamicWrapper(app, ['oss', 'publish'], () => import('../pages/Account/Publish')),
      },

      // 第三方
      {
        name: '回调',
        id: 'calback',
        key: 'callback',
        path: 'callback',
        isHide: true,
        children: [
          {
            name: '微信回调',
            id: 'callback.wechat.login',
            key: 'wechatLogin',
            path: 'wechatLogin',
            component: dynamicWrapper(app, [], () => import('../pages/Callback/WechatLogin')),
          },
          {
            name: '微博回调',
            id: 'callback.weibo.login',
            key: 'weiboLogin',
            path: 'weiboLogin',
            component: dynamicWrapper(app, [], () => import('../pages/Callback/WeiboLogin')),
          },
          {
            name: 'QQ回调',
            id: 'callback.qq.login',
            key: 'qqLogin',
            path: 'qqLogin',
            component: dynamicWrapper(app, [], () => import('../pages/Callback/QqLogin.js')),
          },
        ]
      },

      // 其他
      {
        name: '帮助中心',
        id: 'menu.help',
        key: 'help',
        path: 'help',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Help')),
      },
      {
        name: '服务条款',
        id: 'menu.service',
        key: 'service',
        path: 'service',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Service')),
      },
      {
        name: '联系我们',
        id: 'menu.contact',
        key: 'contact',
        path: 'contact',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Contact')),
      },
      {
        name: '网站地图',
        id: 'menu.sitemap',
        key: 'sitemap',
        path: 'sitemap',
        isHide: true,
        component: dynamicWrapper(app, ['oss'], () => import('../pages/Other/Sitemap')),
      },

    ]
  },

];

export default BaseRoutes;
