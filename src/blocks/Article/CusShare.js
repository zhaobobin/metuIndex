/**
 * 自定义分享
 * url [String] 分享链接
 * title [String] 分享标题
 * desc [String] 分享描述
 * style [Object] 自定义样式
 * https://github.com/loo41/share-react
 */
import React from 'react';
import { Icon } from 'antd'
import { Qq, Weibo } from 'share-react';
import QRCode from 'qrcode.react'
import { ENV } from '@/utils'
import styles from './CusShare.less'

export default function CusShare ({url, title, desc, style}) {

  //分享链接取，设置的url，或者浏览器当前url
  let shareParams = {
    url: url || window.location.href,
    title: title || ENV.hometitle,
    desc: desc || ENV.shareDesc,
  };

  return(
    <ul className={styles.CusShare}>

      <li className={styles.weichat} style={style}>
        <span>
          <Icon type="wechat" />
        </span>
        <span className={styles.ma}>
          <QRCode value={shareParams.url} size={100}/>
        </span>
      </li>

      <li className={styles.qq} style={style}>
        <Qq data={shareParams} windowWidth={800} windowHeight={700}>
          <span className={styles.qq}>
            <Icon type="qq" />
          </span>
        </Qq>
      </li>

      <li className={styles.weibo} style={style}>
        <Weibo data={shareParams} windowWidth={800} windowHeight={700}>
          <span className={styles.zone}>
            <Icon type="weibo" />
          </span>
        </Weibo>
      </li>

    </ul>
  )
};
