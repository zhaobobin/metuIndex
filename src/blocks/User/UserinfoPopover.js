/**
 * UserinfoPopover
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Popover, Skeleton, Avatar, Button } from 'antd';
import styles from './UserinfoPopover.less'

import { Toast } from '@/components'
import SignAuth from '@/blocks/Auth/SignAuth'

@connect(state => ({
  global: state.global,
}))
export default class UserinfoPopover extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      userInfo: '',
      following_state: ''
    }
  }

  queryUserinfo = (userId) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false

    this.props.dispatch({
      type: 'global/request',
      url: `/users/${userId}`,
      method: 'GET',
      payload: {

      },
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 1000)
        if(res.code === 0){
          this.setState({
            loading: false,
            userInfo: res.data,
            following_state: res.data.following_state || ''
          })
        }
      }
    })
  }

  onVisibleChange = (visible) => {
    if(visible){
      this.queryUserinfo(this.props.id);
    }
  }

  // 检查权限：未登录、本人
  checkAuth = () => {
    if (!this.signAuth.check()) return false;
    const {userInfo} = this.state;
    const {currentUser} = this.props.global
    return userInfo._id !== currentUser._id
  }

  // 关注
  following = () => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!this.checkAuth()) return;

    const { userInfo, following_state } = this.state;

    this.props.dispatch({
      type: 'global/request',
      url: `/users/following/${userInfo._id}`,
      method: following_state ? 'DELETE' : 'PUT',
      payload: {},
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === 0) {
          this.setState({
            following_state: res.data.following_state
          })
        } else {
          Toast.info(res.message, 2)
        }
      }
    })

  };

  render(){

    const { loading, userInfo, following_state } = this.state;
    const { currentUser } = this.props.global;

    const content = (
      <div className={styles.container}>
        <Skeleton loading={loading} avatar>
          <div className={styles.body}>

            <div
              className={styles.cover}
              style={{
                backgroundImage: userInfo.cover_url
              }}
            />

            <div className={styles.avatar}>
              <Link to={`/users/${userInfo.username}`}>
                {
                  userInfo.avatar_url ?
                    <Avatar src={userInfo.avatar_url + '?x-oss-process=style/thumb_s'} size={84} />
                    :
                    <Avatar icon="user" size={84} />
                }
              </Link>
            </div>

            <div className={styles.name}>
              <span>{userInfo.nickname}</span>
            </div>

            <div className={styles.info}>
              <p>
                <span>关注 {userInfo.following_number}</span>
                <span>粉丝 {userInfo.followers_number}</span>
                <span>{userInfo.city ? userInfo.city.name : '中国'}</span>
              </p>
              <p>
                <span>{userInfo.headline || ''}</span>
              </p>
            </div>

            <div className={styles.action}>
              {
                userInfo._id === currentUser._id ?
                  null
                  :
                  <Button type="primary" onClick={this.following}>
                    <span>{following_state ? '已关注' : '关注'}</span>
                  </Button>
              }
            </div>

            <SignAuth onRef={ref => this.signAuth = ref} />

          </div>
        </Skeleton>
      </div>
    )

    return(
      <Popover
        trigger="hover"
        placement={this.props.placement || 'top'}
        content={content}
        arrowPointAtCenter
        onVisibleChange={this.onVisibleChange}
        overlayStyle={{ padding: 0 }}
      >
        {this.props.children}
      </Popover>
    )
  }

}
