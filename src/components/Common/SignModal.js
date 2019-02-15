import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Icon, Menu, Dropdown } from 'antd';
import {ENV, Storage} from "~/utils/utils";
import styles from './SignModal.less';

import UserSignModal from '~/components/User/UserSignModal';
import { Confirm } from '~/components/Dialog/Dialog'

@connect(state => ({
  global: state.global
}))
export default class UserSign extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  //登录注册modal状态
  setUserModal(value, key){
    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: value,
        signTabKey: key,
      }
    });
  }

  //退出登录
  logout = () => {
    Confirm({
      title: '退出登录?',
      callback: (res) => {
        if(res === 1) {
          this.props.dispatch({
            type: 'global/logout',
          });
        }
      }
    });
  };

  render() {

    const { isAuth, currentUser } = this.props.global;

    return(
      <div className={styles.userAction}>

        {
          isAuth ?
            <div key="logout">

              <Dropdown
                overlay={
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
                }
              >
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

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Link to="/publish/photo">发布图片</Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/publish/article">发布文章</Link>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Link to="/publish/photo"><Button className={styles.userBtn} type="primary">发布</Button></Link>
              </Dropdown>

            </div>
            :
            <div key="login">
              <Button className={styles.userBtn + " " + styles.loginBtn} onClick={ () => this.setUserModal(true, '1') }>登录</Button>
              <Button className={styles.userBtn} type="primary" onClick={ () => this.setUserModal(true, '2') }>注册</Button>
            </div>
        }

        <UserSignModal/>

      </div>
    )

  }

}
