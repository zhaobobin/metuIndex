/*
* 用户资料
* */
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import Moment from 'moment';

import styles from './AccountAbout.less';

export default class AccountAbout extends PureComponent {

  render(){

    const detail = this.props.detail;

    return(
      <div className={styles.userAbout}>
        <dl>
          <dt><strong>基本信息</strong></dt>
          <dd>
            <p><label>居住地：</label> <span>{detail.city}</span></p>
            <p><label>注册时间：</label> <span>{Moment(detail.createtime).format('YYYY-MM-DD')}</span></p>
            <p><label>描述：</label> <span></span></p>
          </dd>
        </dl>

        <dl>
          <dt>订阅的标签</dt>
          <dd></dd>
        </dl>

        <dl>
          <dt>常用的标签</dt>
          <dd></dd>
        </dl>

        <dl>
          <dt>常用的器材</dt>
          <dd></dd>
        </dl>

      </div>
    )
  }

}
