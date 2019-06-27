import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Icon, Menu, Dropdown } from 'antd';
import {FormattedMessage} from 'react-intl';
import styles from './GlobalHeaderSign.less';

import UserSignModal from '~/blocks/User/UserSignModal';
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
                      <Link to={`/u/${currentUser.nickname}`}>
                        <FormattedMessage id="menu.user.account"/>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/setting">
                        <FormattedMessage id="menu.user.setting"/>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <a onClick={this.logout}>
                        <FormattedMessage id="menu.user.logout"/>
                      </a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Link className={styles.userInfo} to={`/u/${currentUser.username}`}>
                  {
                    currentUser.avatar ?
                      <img src={currentUser.avatar + '?x-oss-process=style/thumb_s'} alt="avatar" />
                      :
                      <Icon type="user" />
                  }
                  <span className={styles.username}>{currentUser.nickname}</span>
                </Link>
              </Dropdown>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Link to="/publish/photo">
                        <FormattedMessage id="menu.publish.photo"/>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/publish/article">
                        <FormattedMessage id="menu.publish.article"/>
                      </Link>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Link to="/publish/photo"><Button className={styles.userBtn} type="primary">
                  <FormattedMessage id="menu.publish"/>
                </Button></Link>
              </Dropdown>

            </div>
            :
            <div key="login">
              <Button className={styles.userBtn + " " + styles.loginBtn} onClick={ () => this.setUserModal(true, '1') }>
                <FormattedMessage id="menu.user.login"/>
              </Button>
              <Button className={styles.userBtn} type="primary" onClick={ () => this.setUserModal(true, '2') }>
                <FormattedMessage id="menu.user.register"/>
              </Button>
            </div>
        }

        <UserSignModal/>

      </div>
    )

  }

}
