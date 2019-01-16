import { ENV } from './src/utils/utils';
const path = require('path');

export default {
  "entry": "src/index.js",
  "outputPath": "./dist/index/",
  "publicPath": "/index/",
  "hash": true,
  "ignoreMomentLocale": true,
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
  ],
  "alias": {
    "~": path.resolve(__dirname, "./src"),
    "~@": path.resolve(__dirname, "./src/theme"),
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
      "target": "http://localhost:8080/",
        "changeOrigin": true,
        "pathRewrite": { "^/api" : "" }
    }
  }
}
