/**
 * 微信授权登录 - 回调页面
 * 获取access_token：https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
 * 刷新access_token：https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { ENV, Storage, getUrlParams } from '~/utils/utils'
import styles from './WechatLogin.less'

const paramsObj = getUrlParams() || '';

@connect(state => ({
  global: state.global
}))
export default class WechatLogin extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loginAuth: '',
      error: '',
      access_token: '',
    }
  }

  componentDidMount(){
    this.getAccessToken();
  }

  init = () => {

  };

  // 获取access_token, 本地存储的state超过一小时视为过期
  getAccessToken = () => {

    let state = paramsObj.state;
    if(!state || state !== Storage.get(ENV.storageWechatLoginState, 3600)){
      // 非法操作
      this.setState({error: '非法操作：state过期'});
      return;
    }

    this.props.dispatch({
      type: 'global/post',
      url: 'api/getWechatLoginAccessToken',
      payload: {
        code: paramsObj.code,
      },
      callback: (res) => {
        if(res.status === 1){
          Storage.set(ENV.storageWechatLoginAccessToken, res.access_token);
          Storage.set(ENV.storageWechatLoginRefreshToken, res.fresh_token);
          this.setState({
            access_token: res.access_token
          })
        }else{
          this.setState({error: '非法操作：code过期'});
        }
      }
    });

  };

  // 刷新access_token
  refreshAccessToken = () => {

    let state = paramsObj.state;
    if(!state || state !== Storage.get(ENV.storageWechatLoginState, 3600)){
      // 非法操作
      this.setState({error: '非法操作：state过期'});
      return;
    }

    this.props.dispatch({
      type: 'global/post',
      url: 'api/refreshWechatLoginAccessToken',
      payload: {
        refresh_token: Storage.get(ENV.storageWechatLoginRefreshToken),
      },
      callback: (res) => {
        if(res.status === 1){
          Storage.set(ENV.storageWechatLoginAccessToken, res.access_token);
          Storage.set(ENV.storageWechatLoginRefreshToken, res.fresh_token);
          this.setState({
            access_token: res.access_token
          })
        }else{
          this.setState({error: '非法操作：code过期'});
        }
      }
    });

  };

  // 登录
  login = () => {

  };

  render(){

    return(

      <div className={styles.WechatLogin}>

        <Row>
          <Col xs={0} sm={0} md={3} lg={5} />
          <Col xs={24} sm={24} md={18} lg={14}>

            <div className={styles.container}>
              <p>WechatLogin</p>

              <div className={styles.wechatInfo}>

              </div>

              <p className={styles.error}>{this.state.error}</p>

              <p className={styles.toekn}>{this.state.access_token}</p>

            </div>

          </Col>
          <Col xs={0} sm={0} md={3} lg={5} />
        </Row>

      </div>

    )
  }

}
