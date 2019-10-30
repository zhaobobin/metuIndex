/**
 * 微信扫码授权登录
 * 参考：https://www.npmjs.com/package/wxlogin.react
 */
import React from 'react';
import WxLogin from 'wxlogin.react';
import WechatConfig from '@/config/wechat'
import { ENV, Storage, Encrypt } from '@/utils';

export default class UserWechatLogin extends React.Component {

  render(){

    const WechatLoginState = Encrypt('wechatlogin', ('metuwang' + Math.random()));
    Storage.set(ENV.storage.wechatLoginState, WechatLoginState);

    return(
      <div>

        {/*<h4>*/}
          {/*<p>*/}
            {/*<span>微信扫码 安全登录</span>*/}
          {/*</p>*/}
          {/*<hr/>*/}
        {/*</h4>*/}

        <WxLogin
          option={{
            appid: WechatConfig.AppId,
            userServiceAPI: WechatConfig.redirect_uri,
            scope: WechatConfig.scope,
            state: WechatLoginState,
            userServiceParams: {
              from: 'pc',
              flag: 'signin',
              type: 'weixin',
              env: 'development',
              uid: '',
            },
            smartRedirect: '',
            href: '',  // 'data:text/css;base64,' + Base64.encode('./UserWechatLoginHref.css')
          }}
          style={{
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            textAlign: 'center'
          }}
        />

      </div>
    )
  }

}
