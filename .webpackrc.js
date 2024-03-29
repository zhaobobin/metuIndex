import ENV from './src/config/env';
const path = require('path');
// console.log(ENV)

let proxyApi;
switch (process.env.X_ENV) {
  case 'dev':
    proxyApi = ENV.api.dev;
    break;
  case 'pro':
    proxyApi = ENV.api.pro;
    break;
  default:
    proxyApi = ENV.api.pro;
}

export default {
  "entry": "src/index.js",
  "outputPath": "./dist/www/",
  "publicPath": "/",
  "hash": true,
  "ignoreMomentLocale": true,
  "theme": "./src/theme/theme.js",
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }, "antd"],
    ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es", "style": true }, "antd-mobile"],
  ],
  "alias": {
    "@": path.resolve(__dirname, "./src"),
    '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/utils/icons.js')
  },
  "env": {
    "development": {
      "extraBabelPlugins": ["dva-hmr"],
      "publicPath": "/"
    }
  },
  "html": {
    "template": "./src/index.ejs",
    "appname": ENV.appname,
    "title": ENV.hometitle,
    "keywords": ENV.keywords,
    "description": ENV.description,
    "author": ENV.author,
  },
  "lessLoaderOptions": {
    "javascriptEnabled": true,
  },
  "browserslist": [
    "> 1% in CN"
  ],
  "externals": {
    "BMap": "BMap",
    "BMapLib": "BMapLib",
    "g2": "G2",
    "g-cloud": "Cloud",
    "g2-plugin-slider": "G2.Plugin.slider",
  },
  "proxy": {
    "/api": {
      "target": proxyApi,
        "changeOrigin": true,
        // "pathRewrite": { "^/api" : "" }
    }
  }
}
