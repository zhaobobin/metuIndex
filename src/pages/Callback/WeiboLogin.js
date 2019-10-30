/**
 * 微博授权登录 - 回调页面
 * 截取链接中的code码，然后发给后端，去查询access_token
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
import { ENV, Storage } from '@/utils';
import { getUrlParams } from '@/utils/utils'
import styles from './WeiboLogin.less'

import UserRegister from '@/blocks/User/UserRegister';

const paramsObj = getUrlParams() || '';

@connect(state => ({
  global: state.global
}))
export default class WeiboLogin extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      error: '',
      weibo_userinfo: ''
    }
  }

  componentDidMount(){
    this.weiboLoginAuth();
  }

  // step1: 微博授权登录校验 code换取access_token，access_token查询weibo_userinfo
  weiboLoginAuth = () => {

    let state = paramsObj.state;
    if(!state || state !== Storage.get(ENV.storage.weiboLoginState)){
      // 非法操作
      // this.setState({error: 'state已过期'});
      this.props.dispatch(routerRedux.push('/'));
      return;
    }

    this.props.dispatch({
      type: 'global/post',
      url: 'api/weiboLoginAuth',
      payload: {
        code: paramsObj.code,                   // code是一次性的参数，code的有效时间非常短，一般为30秒
      },
      callback: (res) => {
        if(res.status === 1){     // 已注册，直接登录
          this.changeLoginStatus(res.data)
        }
        else if(res.status === 2){  //未注册，用户关联注册
          this.setState({
            weibo_userinfo: res.data
          })
        }
        else{
          this.setState({error: 'code过期，' + res.msg});
        }
      }
    });

  };

  // step2: 微信用户关联注册
  registerCallback = () => {
    this.props.dispatch(routerRedux.push('/'));
  };

  // step3: 修改登录用户信息
  changeLoginStatus = (data) => {
    Storage.set(ENV.storage.token, data.token);              //保存token
    this.props.dispatch({
      type: 'global/changeLoginStatus',
      payload: {
        loading: false,
        isAuth: true,
        currentUser: data.currentUser,
        token: data.token
      }
    });
    this.props.dispatch(routerRedux.push('/'));
  };


  render(){

    const { error, weibo_userinfo } = this.state;

    return(

      <div className={styles.WeiboLogin}>

        <Row>
          <Col xs={0} sm={0} md={4} lg={6} />
          <Col xs={24} sm={24} md={16} lg={12}>

            <div className={styles.container}>

              {
                weibo_userinfo ?
                  <div className={styles.weibo_userinfo}>

                    <p className={styles.userinfo}>
                      <img src={weibo_userinfo.profile_image_url} alt="avatar"/>
                      <span>尊敬的微博用户：</span>
                      <span className={styles.nickname}>{weibo_userinfo.name}</span>
                    </p>

                    <p className={styles.desc}>为了给您更好的服务，请关联一个{ENV.appname}账号，便于您下次快速登录</p>

                    <UserRegister
                      weibo_userinfo={weibo_userinfo}
                      nickname={weibo_userinfo.name}
                      callback={this.registerCallback}
                    />

                  </div>
                  :
                  null
              }

              {
                error ?
                  <p className={styles.error}>
                    <span>错误提示：</span>
                    <span>{error}</span>
                  </p>
                  :
                  null
              }

            </div>

          </Col>
          <Col xs={0} sm={0} md={4} lg={6} />
        </Row>

      </div>

    )
  }

}
