/**
 * 自定义分享
 * url [String] 分享链接
 * title [String] 分享标题
 * desc [String] 分享描述
 * style [Object] 自定义样式
 * https://github.com/loo41/share-react
 */
import React from 'react';
import { Qq, Qzone } from 'share-react';
import QRCode from 'qrcode.react'
import { ENV } from '~/utils/utils'
import styles from './CusShare.less'

//import logo from '~/assets/com/loading logo_120_120@2x.png'
import weixinImg from '~/assets/share/websiteannouncement_icon2@2x.png'
import qqImg from '~/assets/share/websiteannouncement_icon3@2x.png'
import zoneImg from '~/assets/share/websiteannouncement_icon1@2x.png'

export default function CusShare ({url, title, desc, style}) {

  //分享链接取，设置的url，或者浏览器当前url
  let shareParams = {
    url: url,
    title: title || ENV.hometitle,
    desc: desc || ENV.shareDesc,
  };

  return(
    <ul className={styles.CusShare}>

      <li className={styles.weichat} style={style}>
        <span>
          <img src={weixinImg} alt="weichat"/>
        </span>
        <span className={styles.ma}><QRCode value={shareParams.url} size={120}/></span>
      </li>

      <li className={styles.qq} style={style}>
        <Qq data={shareParams} windowWidth={800} windowHeight={700}>
          <span className={styles.qq}>
            <img src={qqImg} alt="qq"/>
          </span>
        </Qq>
      </li>

      <li className={styles.zone} style={style}>
        <Qzone data={shareParams} windowWidth={800} windowHeight={700}>
          <span className={styles.zone}>
            <img src={zoneImg} alt="Qzone"/>
          </span>
        </Qzone>
      </li>

    </ul>
  )
};
