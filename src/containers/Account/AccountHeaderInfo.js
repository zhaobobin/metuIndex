import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Avatar, Button } from 'antd';
import styles from './AccountHeaderInfo.less'

import SignAuth from '@/blocks/Auth/SignAuth'

@connect(state => ({
  global: state.global,
}))
export default class AccountHeaderInfo extends React.Component {

  // 关注用户
  followingUser = () => {
    const user_id = this.props.global.profileUser._id;
    this.props.dispatch({
      type: 'global/request',
      url: `/users/following/${user_id}`,
      method: 'PUT',
      payload: {},
      callback: (res) => {}
    })
  }

  // 完善个人资料
  editUserDetail = () => {
    this.props.dispatch(routerRedux.push('/settings/bind'));
  }

  render(){

    const { profileUser, currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        <div className={styles.avatar}>
          {
            profileUser.avatar_url ?
              <Avatar src={profileUser.avatar_url + '?x-oss-process=style/thumb_s'} size={100} />
              :
              <Avatar icon="user" size={100} />
          }
        </div>

        <div className={styles.btns}>
          <Button>分享</Button>
          {
            profileUser._id === currentUser._id ?
              <Button type="primary" onClick={this.editUserDetail}>完善个人资料</Button>
              :
              <SignAuth
                onRef={ref => this.signAuth = ref}
                callback={this.followingUser}
              >
                <Button type="primary" onClick={() => this.signAuth.check()}>关注</Button>
              </SignAuth>
          }
        </div>

        <div className={styles.detail}>

          <h1 className={styles.username}>
            <span>{profileUser.nickname}</span>
          </h1>

          <p className={styles.headline}>
            <span>{profileUser.headline}</span>
          </p>

          <p className={styles.info}>
            <span>{profileUser.location || '中国'}</span>
            <span>关注 {profileUser.following_number}</span>
            <span>粉丝 {profileUser.followers_number}</span>
          </p>

        </div>

      </div>
    )
  }
}
