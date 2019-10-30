/**
 * QQ授权登录 - 回调页面
 * 截取链接中的code，然后传给后端，查询access_token与userinfo
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
import { ENV, Storage } from '@/utils';
import { getUrlParams } from '@/utils/utils'
import styles from './QqLogin.less'

import UserRegister from '@/blocks/User/UserRegister';

const paramsObj = getUrlParams() || '';

@connect(state => ({
  global: state.global
}))
export default class QqLogin extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      error: '',
      qq_userinfo: ''
    }
  }

  componentDidMount(){
    this.qqLoginAuth();
  }

  // step1: QQ授权登录校验 code换取access_token，access_token查询qq_userinfo
  qqLoginAuth = () => {

    let state = paramsObj.state;
    if(!state || state !== Storage.get(ENV.storage.qqLoginState)){
      // 非法操作
      // this.setState({error: 'state已过期'});
      this.props.dispatch(routerRedux.push('/'));
      return;
    }

    this.props.dispatch({
      type: 'global/post',
      url: 'api/qqLoginAuth',
      payload: {
        code: paramsObj.code,                   // code是一次性的参数，code的有效时间非常短，一般为30秒
      },
      callback: (res) => {
        if(res.status === 1){     // 已注册，直接登录
          this.changeLoginStatus(res.data)
        }
        else if(res.status === 2){  //未注册，用户关联注册
          this.setState({
            qq_userinfo: res.data
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

    const { error, qq_userinfo } = this.state;

    return(

      <div className={styles.QqLogin}>

        <Row>
          <Col xs={0} sm={0} md={4} lg={6} />
          <Col xs={24} sm={24} md={16} lg={12}>

            <div className={styles.container}>

              {
                qq_userinfo ?
                  <div className={styles.qq_userinfo}>

                    <p className={styles.userinfo}>
                      <img src={qq_userinfo.figureurl_2} alt="avatar"/>
                      <span>尊敬的QQ用户：</span>
                      <span className={styles.nickname}>{qq_userinfo.nickname}</span>
                    </p>

                    <p className={styles.desc}>为了给您更好的服务，请关联一个{ENV.appname}账号，便于您下次快速登录</p>

                    <UserRegister
                      qq_userinfo={qq_userinfo}
                      nickname={qq_userinfo.nickname}
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
