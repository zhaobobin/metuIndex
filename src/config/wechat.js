/**
 * 微信授权
 */
export default {
  BaseUrl: 'https://open.weixin.qq.com/connect/qrconnect?',
  AppId: 'wxfef98607d65153a3',
  redirect_uri: 'http://www.metuwang.com/callback/wechatLogin?',
  response_type: 'code',
  scope: 'snsapi_login',
};
