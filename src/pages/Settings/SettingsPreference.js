/**
 * 设置 - 偏好
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd'
import styles from './SettingsFilter.less'

@connect(state => ({
  global: state.global
}))
export default class SettingsPreference extends React.Component {

  render(){

    // const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <strong className={styles.title}>偏好设置</strong>
          <span className={styles.desc}>图片水印</span>
        </div>

        <div className={styles.body}>
          <ul>

            <li>
              <p className={styles.p1}>
                <strong>图片水印</strong>
              </p>
              <p className={styles.p2}>
                <span>在我上传的图片上显示水印</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

            <li>
              <p className={styles.p1}>
                <strong>快捷键</strong>
              </p>
              <p className={styles.p2}>
                <span>更加方便地浏览知乎，按 ?（Shift + /）查看所有快捷键</span>
              </p>
              <p className={styles.btns}>
                <Button>编辑</Button>
              </p>
            </li>

          </ul>
        </div>

      </div>
    )
  }
}
