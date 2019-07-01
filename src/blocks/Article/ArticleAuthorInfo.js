import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import Moment from 'moment';
import styles from './ArticleAuthorInfo.less'

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

  //检查登录状态
  checkLogin = () => {
    let {isAuth} = this.props.global;
    if(!isAuth){
      this.props.dispatch({
        type: 'global/changeSignModal',
        payload: {
          signModalVisible: true,
          signTabKey: '1',
        }
      });
      this.ajaxFlag = true;
      return false;
    }
    return true;
  };

  //关注
  handleFollow = () => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    if(!this.checkLogin()) return false;								//检查登录状态
  };

  render(){

    const { detail } = this.props;
    const uid = this.props.global.currentUser._id;

    return(
      <div className={styles.container}>
        <Link to={`/u/${detail.uid.username}`} className={styles.avatar}>
          {
            detail.uid.avatar ?
              <img src={detail.uid.avatar + '?x-oss-process=style/thumb_s'} alt="avatar"/>
              :
              <Icon type="user" />
          }
        </Link>
        <p>
          <Link to={`/u/${detail.uid.username}`}>
            <span>{detail.uid.nickname}</span>
          </Link>
        </p>
        <p className={styles.date}>
          <span>{Moment(detail.createtime).format('YYYY-MM-DD')}</span>
          <span><Icon type="eye-o" /> {detail.views}</span>
        </p>
        {
          detail.uid._id === uid ?
            null
            :
            <a className={styles.follow} onClick={this.handleFollow}>
              {
                this.state.followState ? <span>已关注</span> : <span>关注</span>
              }
            </a>
        }

      </div>
    )
  }

}
