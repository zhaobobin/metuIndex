/**
 * Storage 本地存储 检验过期
 * @type {{set: Storage.set, get: Storage.get, remove: Storage.remove}}
 * exp 过期时间的秒数 一天的秒数 60 * 60 * 24
 */
const Storage = {

  // 保存
  set: function (key, value) {

    let curTime = new Date().getTime();
    return window.localStorage.setItem(
      key,
      window.JSON.stringify({ data: value, time: curTime })
    );

  },

  // 查询
  get: function (key, exp) {

    let obj = window.JSON.parse(window.localStorage.getItem(key));
    if (!obj || !obj.data) return false;                         //无记录
    if (exp && new Date().getTime() - obj.time > exp * 1000) {    //过期
      return false
    } else {
      return obj.data;
    }

  },

  // 删除
  remove: function (key) {

    return window.localStorage.removeItem(key);

  },

  // 判断浏览器是否支持 hasLocalSotrage
  hasLocalSotrage: function () {
    return window.localStorage
  },

  //设置cookie
  setCookie: function (key, value, day) {
    let t = day || 30;
    let d = new Date();
    d.setTime(d.getTime() + (t * 24 * 60 * 60 * 1000));
    let expires ="expires="+ d.toUTCString();
    window.document.cookie = key + "=" + value + "; " + expires;
  },

  //获取cookie
  getCookie: function (name) {
    let arr, reg = new RegExp("(^|)" + name + "=([^]*)(|$)");
    if (arr === window.document.cookie.match(reg)) {
      return arr[2];
    }
    else {
      return null;
    }
  },

};

export default Storage;
