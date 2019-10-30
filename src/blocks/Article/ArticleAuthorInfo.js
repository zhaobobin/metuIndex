import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import Moment from 'moment';
import styles from './ArticleAuthorInfo.less'

import SignAuth from '@/blocks/Auth/SignAuth'

@connect(state => ({
  global: state.global,
}))
export default class ArticleAuthorInfo extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      followState: '',
    };
  }

  //关注
  followingUser = () => {
    // todo
  };

  render(){

    const { detail } = this.props;
    const uid = this.props.global.currentUser._id;

    return(
      <div className={styles.container}>
        <Link to={`/users/${detail.author.username}`} className={styles.avatar}>
          {
            detail.author.avatar_url ?
              <img src={detail.author.avatar_url + '?x-oss-process=style/thumb_s'} alt="avatar"/>
              :
              <Icon type="user" />
          }
        </Link>
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
          detail.author._id === uid ?
            null
            :
            <a className={styles.follow}>
              {
                this.state.followState ?
                  <span>已关注</span>
                  :
                  <SignAuth
                    onRef={ref => this.signAuth = ref}
                    callback={this.followingUser}
                  >
                    <span onClick={() => this.signAuth.check()}>关注</span>
                  </SignAuth>

              }
            </a>
        }

      </div>
    )
  }

}
