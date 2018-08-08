import { ENV } from './src/utils/utils';
const packageInfo = require('./package.json');

export default {
  "entry": "src/index.js",
  "publicPath": "/",
  "hash": true,
  "ignoreMomentLocale": true,
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
    ["module-resolver", {
      "root": ["./src"],
      "alias": { "~": "./src" }
    }]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  "html": {
    "template": "./src/index.ejs",
    "title": ENV.hometitle,
    "keywords": ENV.keywords,
    "description": ENV.description,
    "author": ENV.author,
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ],
  "proxy": {
    "/api": {
      "target": "http://localhost:8080/",
        "changeOrigin": true,
        "pathRewrite": { "^/api" : "" }
    }
  }
}
