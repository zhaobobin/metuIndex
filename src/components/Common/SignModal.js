import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Icon, Tabs, Modal, Menu, Dropdown, notification } from 'antd';
import {ENV, Storage} from "~/utils/utils";
import styles from './SignModal.less';

import UserLogin from '~/components/User/UserLogin';
import UserRegister from '~/components/User/UserRegister';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

@connect(state => ({
  global: state.global
}))
export default class UserSign extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      userType: 'user',                               //用户类型
      loginType: 'psd',                               //登录方式
      registerType: 'psd',                            //注册方式

      remember: Storage.get(ENV.storageRemenber) !== null ? Storage.get(ENV.storageRemenber) : true,
      captcha: 'api/captcha.png?rnd=' + Math.random(),
      codeText: '获取验证码',
      errorCount: 0,                                  //表单输入错误次数
    }
  }

  //验证码
  getCaptcha = () => {
    this.setState({
      captcha: 'api/captcha.png?rnd=' + Math.random()
    })
  };

  //tab切换
  changeTabKey(key){
    this.setUserModal(true, key)
  }

  //登录注册modal状态
  setUserModal(value, key){
    if(value) this.getCaptcha();
    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: value,
        signTabKey: key,
      }
    });
  }

  loginCallback = () => {
    this.setUserModal(false, '1');
  };

  registerCallback = () => {
    this.setUserModal(false, '2');
  };

  //退出登录
  logout = () => {
    let _this = this;
    confirm({
      title: '退出登录?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        _this.props.dispatch({
          type: 'global/logout',
        });
      },
      onCancel() {},
    });
  };

  render() {

    const { isAuth, currentUser, signModalVisible, signTabKey } = this.props.global;

    const userMenu = isAuth ?
      <Menu>
        <Menu.Item>
          <Link to={`/u/${currentUser.nickname}`}>我的主页</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/setting">设置</Link>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.logout}>退出</a>
        </Menu.Item>
      </Menu>
      : null;

    const publishMenu = isAuth ?
      <Menu>
        <Menu.Item>
          <Link to="/publish/photo">发布图片</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/publish/article">发布文章</Link>
        </Menu.Item>
      </Menu>
      : null;

    //判断是否登录
    const userShow = isAuth ?
      <div key="logout">
        <Dropdown overlay={userMenu}>
          <Link className={styles.userInfo} to={`/u/${currentUser.username}`}>
            {
              currentUser.avatar ?
                <img src={currentUser.avatar + '?x-oss-process=style/thumb_s'} alt="用户头像" />
                :
                <Icon type="user" />
            }
            <span className={styles.username}>{currentUser.username}</span>
          </Link>
        </Dropdown>
        <Dropdown overlay={publishMenu}>
          <Link to="/publish/photo"><Button className={styles.userBtn} type="primary">发布</Button></Link>
        </Dropdown>
      </div>
      :
      <div key="login">
        <Button className={styles.userBtn + " " + styles.loginBtn} onClick={ () => this.setUserModal(true, '1') }>登录</Button>
        <Button className={styles.userBtn} type="primary" onClick={ () => this.setUserModal(true, '2') }>注册</Button>
      </div>;

    return(
      <div className={styles.userAction}>
        {userShow}

        {/*登陆注册Modal begin! */}
        <Modal
          title=""
          width="400px"
          destroyOnClose={true}
          wrapClassName="vertical-center-modal"
          visible={signModalVisible}
          onCancel={ () => this.setUserModal(false, "1") }
          footer={null}
          className={styles.userModal}
        >
          <Tabs type="card" activeKey={signTabKey} onChange={this.changeTabKey.bind(this)}>

            <TabPane tab="登录" key="1">
              <UserLogin callback={this.loginCallback}/>
            </TabPane>

            <TabPane tab="注册" key="2">
              <UserRegister callback={this.registerCallback}/>
            </TabPane>
          </Tabs>

        </Modal>
        {/*登陆注册Modal end! */}

      </div>
    )

  }

}
