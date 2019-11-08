import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import Moment from 'moment';
import styles from './ArticleAuthorInfo.less'

import { Toast } from '@/components'
import SignAuth from '@/blocks/Auth/SignAuth'
import UserinfoPopover from '@/blocks/User/UserinfoPopover'

@connect(state => ({
  global: state.global,
}))
export default class ArticleAuthorInfo extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      following_state: '',
    };
  }

  componentDidMount(){
    const {following_state} = this.props.detail;
    this.setState({
      loading: false,
      following_state
    })
  }

  // 检查权限：未登录、本人
  checkAuth = () => {
    if (!this.signAuth.check()) return false;
    const {detail} = this.props;
    const {currentUser} = this.props.global
    return detail.author._id !== currentUser._id
  }

  // 关注
  following = () => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!this.checkAuth()) return;

    const { following_state } = this.state;
    const { detail } = this.props;

    this.props.dispatch({
      type: 'global/request',
      url: `/users/following/${detail.author._id}`,
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

    const { loading, following_state } = this.state
    const { detail } = this.props;
    const { currentUser } = this.props.global;

    return(
      <>
        {
          loading ?
            null
            :
            <div className={styles.container}>
              <UserinfoPopover id={detail.author._id} placement="bottomLeft">
                <Link to={`/users/${detail.author.username}`} className={styles.avatar}>
                  {
                    detail.author.avatar_url ?
                      <img src={detail.author.avatar_url + '?x-oss-process=style/thumb_s'} alt="avatar"/>
                      :
                      <Icon type="user" />
                  }
                </Link>
              </UserinfoPopover>
              <p>
                <Link to={`/users/${detail.author.username}`}>
                  <span>{detail.author.nickname}</span>
                </Link>
              </p>
              <p className={styles.date}>
                <span>{Moment(detail.create_at).format('YYYY-MM-DD')}</span>
                <span><Icon type="eye-o" /> {detail.view_number}</span>
              </p>
              {
                detail.author._id === currentUser._id ?
                  null
                  :
                  <a className={styles.follow} onClick={this.following}>
                    <span>{following_state ? '已关注' : '关注'}</span>
                  </a>
              }

              <SignAuth onRef={ref => this.signAuth = ref} />

            </div>
        }
      </>
    )
  }

}
