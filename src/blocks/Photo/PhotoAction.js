/*
 * 图片操作
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './PhotoAction.less';

import { Toast } from '@/components'
import CusShare from '@/blocks/Article/CusShare'
import SignAuth from '@/blocks/Auth/SignAuth'

@connect(state => ({
  global: state.global,
}))
export default class PhotoAction extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      detail: '',
      likeState: false,												                                  //喜欢该文章的状态
      likeCount: '',														                                //喜欢该文章的人数
      collectState: '',													                                //对应当前用户的收藏状态
      followState: '',													                                //对应当前用户的关注状态
    };
  }

  componentDidMount(){
    let data = this.props.data,
      {global} = this.props;
    //this.initArticle(data, global)
  }

  //处理用户登录、退出时，重新渲染文章数据
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.global.isAuth !== this.props.global.isAuth){
      this.initArticle(this.state.detail, nextProps.global)
    }
  }

  // 初始化文章状态
  initArticle(data, global){

  }

  // 检查权限：未登录、本人
  checkAuth = () => {
    if (!this.signAuth.check()) return false;
    const {detail} = this.props;
    const {currentUser} = this.props.global
    return detail.author._id !== currentUser._id
  }

  // 点赞
  favor = () => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if(!this.checkAuth()) return;

    const {detail} = this.props;
    if(detail.favoring_state) {

    } else {

    }

    setTimeout(() => { this.ajaxFlag = true }, 500);

  }

  // 收藏
  collect = () => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if(!this.checkAuth()) return;

    const {detail} = this.props;
    if(detail.collecting_state) {

    } else {

    }

    setTimeout(() => { this.ajaxFlag = true }, 500);

  }

  render(){

    const { detail } = this.props;
    const { likeState, likeCount, collectState} = this.state;

    return(

      <div className={styles.handle}>
        {
          detail ?
            <ul>
              <li className={styles.li1}>
                <a title="点赞" onClick={this.favor}>
                  <Icon type={detail.favoring_state ? "heart" : "heart-o"} />
                  <span className={styles.count}>{detail.favor_number}</span>
                </a>
              </li>
              <li className={styles.li2}>
                <Icon type="message" />
                <span className={styles.count}>{detail.comment_number}</span>
              </li>
              <li className={styles.li3}>
                <CusShare/>
              </li>
              <li className={styles.li4}>
                <Icon type="ellipsis" />
                <div className={styles.menu}>
                  <a title="收藏" onClick={this.collect}>
                    <Icon type={detail.collect_state ? "star" : "star-o"} /> 收藏
                  </a>
                  <a>举报</a>
                </div>
              </li>
              {/*<li><a><Icon type="ellipsis" /></a></li>*/}
            </ul>
            : null
        }

        <SignAuth onRef={ref => this.signAuth = ref} />

      </div>

    )

  }

}
