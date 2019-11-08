import moment from 'moment';
import { notification } from 'antd';
import { parse, stringify } from 'qs';
// import WechatConfig from '@/config/wechat'

/**
 * 生成唯一编码id
 * @returns {string}
 */
export function createRandomId() {
  return (new Date()).getTime().toString().substr(0, 4) + Math.random().toString().substr(2, 5);
}

/*************************** 通用工具函数 ***************************/

export function openwindow(url,name,iWidth,iHeight) {
  //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
  let iTop = (window.screen.height-30-iHeight)/2;       //获得窗口的垂直位置;
  let iLeft = (window.screen.width-10-iWidth)/2;        //获得窗口的水平位置;
  window.open(url, name, 'height='+iHeight+',innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}

// 生成微信长链接
// export function getWechatUrl() {
//   let url = WechatConfig.BaseUrl;
//   let params = {
//     appid: WechatConfig.AppId,
//     redirect_uri: encodeURI(WechatConfig.redirect_uri),
//     response_type: WechatConfig.response_type,
//     scope: WechatConfig.scope,
//   };
//   for (let i in params) {
//     url += (i + '=' + encodeURIComponent(params[i]) + '&');
//   }
//   return url.substring(0, url.lastIndexOf('&'));
// }

//浏览器后退
export function goBack(){
  if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
    if(window.history.length > 0){
      window.history.go(-1);
    }else{
      window.location.href = this.ENV.siteUrl
    }
  }else{ //非IE浏览器
    if (navigator.userAgent.indexOf('Firefox') >= 0 ||
      navigator.userAgent.indexOf('Opera') >= 0 ||
      navigator.userAgent.indexOf('Safari') >= 0 ||
      navigator.userAgent.indexOf('Chrome') >= 0 ||
      navigator.userAgent.indexOf('WebKit') >= 0){

      if(window.history.length > 1){
        window.history.go(-1);
      }else{
        window.location.href = this.ENV.siteUrl
      }
    }else{ //未知的浏览器
      window.history.go(-1);
    }
  }
}

/**
 * 拆解url参数转换为对象
 * @returns {Object}
 */
export function getUrlParams() {
  // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
  let url = window.location.href.split('?')[1];
  if (!url) return false;
  let arr = url.split("&");
  let obj = {};

  // 将每一个数组元素以=分隔并赋给obj对象
  for (let i = 0; i < arr.length; i++) {
    let tmp_arr = arr[i].split("=");
    obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
  }
  return obj;
}

/*************************** 表单工具函数 ***************************/

//字段错误校验
export function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/*************************** 字符串工具函数 ***************************/

/**
 * 过滤文字中的特殊符号
 * @param str
 * @returns {string}
 */
export function filterStr(str) {
  let pattern = new RegExp("[`~@#$^&|\\<>/~@#￥&]");
  let specialStr = "";
  for (let i = 0; i < str.length; i++) {
    specialStr += str.substr(i, 1).replace(pattern, '');
  }
  return specialStr;
}

//过滤手机号
export function filterTel(str) {

  return str.toString().replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");

}

//过滤卡号
export function filterBankcard(str) {

  let newStr = str.substring(0, 4) + ' **** **** *' + str.substring(14, 16);
  return newStr;

}

//检查操作权限
export function checkRole(roleid) {
  if(roleid === 9){
    return true;
  }else{
    notification.error({ message: '只有超级管理员有权操作！' });
    return false;
  }
}

export function getRichText(str, length=100){
  const reg = new RegExp("<.+?>","g");
  return str.replace(reg,'').slice(0, length); //执行替换成空字符
}

/*************************** 图片工具函数 ***************************/

/**
 * 图片转base64
 * @param img
 * @returns {string}
 */
export function imgToBase64(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas.toDataURL("image/jpeg");
}

//文件转为base64
export function file2base64(file, cb) {

  let base64 = '', reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function (e) {

    base64 = e.target.result;

    let img = new Image();
    img.src = base64;
    img.onload = function () {
      let data = {
        url: base64,
        width: this.width,
        height: this.height
      };
      return cb(data);
    };

  };
}

/**
 * 将base64转换为文件
 * @param dataurl
 * @returns {Blob}
 */
export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

//获取图片尺寸
export function getImgSize(url, cb){
  let img = new Image();
  img.src = url;
  img.onload = function(){
    let obj = {
      width: img.width,
      height: img.height
    };
    return cb(obj)
  }
}

export function toBase64(file){

  return new Promise(function(resolve, reject){
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      resolve(e.target.result)
    };
  })

}

export function img2base64(imgUrl, cb){

  let base64 = '',
    img = new Image(),
    cav = document.createElement('canvas'),
    ctx = cav.getContext('2d');

  img.src = imgUrl;
  img.onload = function() {
    cav.width = img.width;
    cav.height = img.height;
    ctx.drawImage(img, 0, 0);					//img转换为canvas
    base64 = cav.toDataURL('images/jpeg');
    return cb(base64);
  };
}

/*************************** 数值工具函数 ***************************/

/**
 * 空值工具函数
 * @param val
 * @returns {boolean}
 */
export function isEmptyValue(val) {
  if (val === '' || val === null || val === 'null' || val === undefined || val === 'undefined') return true
  return false;
};

/**
 * 金额字符串转数值
 * @param numStr
 * @returns {number}
 */
export function str2Number(numStr) {
  let str = isEmptyValue(numStr) ? 0 : numStr;
  let param = str.toString();
  if (!param.includes(',')) return parseFloat(param);
  let arr = str.split(',');
  return parseFloat(arr.join(''));
}

/**
 * 金额数值格式化
 * @param number
 * @param intFlag     正整数
 * @returns {*}
 */
export function numberFormat(number, intFlag) {

  if (typeof number === 'string' && number.includes(',')) return number;             //已格式化的直接反复

  let result = '',
    float = '.00',
    num = number.toString();

  if (parseInt(number, 10) !== number) {                          //是否是整数
    let split = num.split('.');
    num = split[0];
    float = '.' + (split[1] && split[1].length===1 ? split[1]+'0' : split[1])
  }
  if(intFlag){
    float = '';
  }

  //加入分隔符
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }

  return num + result + float;
}


/**
 * 金额大写
 * @param n
 * @returns {string}
 */
export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}
