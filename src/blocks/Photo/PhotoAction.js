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
      loading: true,
      _id: '',
      favoring_state: '',													                              // 点赞状态
      favor_number: '',													                                // 点赞数量
      comment_number: '',                                                       // 评论数量
      collecting_state: '',													                            // 对应当前用户的收藏状态
    };
  }

  componentDidMount(){
    const {
      _id, favoring_state, favor_number,
      comment_number, collecting_state
    } = this.props.detail;
    this.setState({
      loading: false,
      _id,
      favoring_state,
      favor_number,
      comment_number,
      collecting_state
    })
  }

  //处理用户登录、退出时，重新渲染文章数据
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.global.isAuth !== this.props.global.isAuth){
      this.queryPhotosState(this.state._id)
    }
  }

  // 查询文章状态
  queryPhotosState(id){
    this.props.dispatch({
      type: 'global/request',
      url: `/photos/${id}/state`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        if(res.code === 0){
          this.setState({
            favoring_state: res.data.favoring_state,
            favor_number: res.data.favor_number,
            comment_number: res.data.comment_number,
            collecting_state: res.data.collecting_state
          })
        }else{
          Toast.info(res.message, 2)
        }
      }
    });
  }

  // 检查权限：未登录、本人
  checkAuth = () => {
    if (!this.signAuth.check()) return false;
    const {detail} = this.props;
    const {currentUser} = this.props.global;
    return detail.author._id !== currentUser._id
  }

  // 点赞
  favor = () => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!this.checkAuth()) return;

    const { _id, favoring_state } = this.state;

    this.props.dispatch({
      type: 'global/request',
      url: `/photos/favoring/${_id}`,
      method: favoring_state ? 'DELETE' : 'PUT',
      payload: {},
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === 0) {
          this.setState({
            favoring_state: res.data.favoring_state,
            favor_number: res.data.favor_number
          })
        } else {
          Toast.info(res.message, 2)
        }
      }
    })

  }

  // 收藏
  collect = () => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!this.checkAuth()) return;

    const { _id, collecting_state } = this.state;

    this.props.dispatch({
      type: 'global/request',
      url: `/photos/collecting/${_id}`,
      method: collecting_state ? 'DELETE' : 'PUT',
      payload: {},
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === 0) {
          this.setState({
            collecting_state: res.data.collecting_state
          })
        } else {
          Toast.info(res.message, 2)
        }
      }
    })

  }

  render(){

    const { theme } = this.props
    const { loading, favoring_state, favor_number, comment_number, collecting_state } = this.state;

    return(

      <>
        {
          loading ?
            null
            :
            <div className={styles.handle + " " + styles[theme]}>

              <ul>
                <li className={styles.li1}>
                  <a title="点赞" onClick={this.favor}>
                    {
                      favoring_state ?
                        <Icon type="heart" theme="filled" />
                        :
                        <Icon type="heart" />
                    }
                    <span className={styles.count}>{favor_number}</span>
                  </a>
                </li>
                <li className={styles.li2}>
                  <Icon type="message" />
                  <span className={styles.count}>{comment_number}</span>
                </li>
                <li className={styles.li3}>
                  <CusShare/>
                </li>
                <li className={styles.li4}>
                  <Icon type="ellipsis" />
                  <div className={styles.menu}>
                    <a title="收藏" onClick={this.collect}>
                      {
                        collecting_state ?
                          <Icon type="star" theme="filled" />
                          :
                          <Icon type="star" />
                      }
                      <span>收藏</span>
                    </a>
                    <a>举报</a>
                  </div>
                </li>
                {/*<li><a><Icon type="ellipsis" /></a></li>*/}
              </ul>

              <SignAuth onRef={ref => this.signAuth = ref} />

            </div>
        }
      </>

    )

  }

}
