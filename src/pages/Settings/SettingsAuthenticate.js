/**
 * 设置 - 实名认证
 */
import React from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import { ENV } from '@/utils';
import styles from './SettingsAuthenticate.less';

@connect(state => ({
  global: state.global
}))
export default class SettingsAuthenticate extends React.Component {

  render() {

    // const {currentUser} = this.props.global

    return (
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>实名认证</strong>
        </div>

        <div className={styles.body}>

          <dl>
            <dt>认证须知</dt>
            <dd>
              <p>1、实名认证可以提升你在{ENV.appname}的个人信息及虚拟财产的安全等级，同时也能够更好的体验{ENV.appname}的各项虚拟服务；</p>
              <p>2、我们将在你提交身份证信息后的5个工作日（不包含节假日）内完成审核，审核结果将会以短信和系统通知的形式发送给你；</p>
              <p>3、如若账号还未绑定手机，建议你提前<Link to="/settings/bind">绑定手机</Link>；</p>
              <p>4、实名认证审核完成后，将无法修改和删除，请谨慎填写；</p>
              <p>5、实名认证审核完成后，系统将自动发放10个积分作为奖励；查看积分</p>
              <p>6、你需要准备身份证照片（需正反两面），请确保证件照片清晰可见，严禁PS，具体可参考<Link to="/help">实名认证常见问题</Link>；</p>
              <p>7、我们会确保你所提供的信息均处于严格的保密状态，不会泄露；</p>
              <p>8、如存在恶意乱填写姓名，身份证号码，及上传与身份证证件无关图片者，一经发现将冻结{ENV.appname}账号。</p>
            </dd>
          </dl>

        </div>

      </div>
    )
  }
}
