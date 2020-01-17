import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Avatar, Button, Icon, Menu, Dropdown } from 'antd';
import { FormattedMessage } from 'react-intl';
import styles from './GlobalHeaderSign.less';

import GlobalHeaderSearch from '@/components/Common/GlobalHeaderSearch';
import MessagesPopover from '@/blocks/Messages/MessagesPopover';
import UserSignModal from '@/blocks/User/UserSignModal';
import { Confirm } from '@/components/Dialog/Dialog';

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

  // 切换登录注册modal状态
  setUserModal(value, key){
    this.props.dispatch({
      type: 'global/changeSignModal',
      payload: {
        signModalVisible: value,
        signTabKey: key,
      }
    });
  }

  // 退出登录
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
            <ul key="logout">

              <li>
                <GlobalHeaderSearch/>
              </li>

              <MessagesPopover>
                <li>
                  <a className={styles.message}>
                    <Icon type="bell" style={{ fontSize: '24px' }} />
                  </a>
                </li>
              </MessagesPopover>

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
                <li>
                  <Link to="/publish/photo" className={styles.hasIcon + ' ' + styles.publish}>
                    <Icon type="cloud-upload" style={{ fontSize: '24px' }} />
                    <FormattedMessage id="menu.publish"/>
                  </Link>
                </li>
              </Dropdown>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Link to={`/users/${currentUser.username}`}>
                        <FormattedMessage id="menu.user.account"/>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/settings">
                        <FormattedMessage id="menu.user.settings"/>
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
                <li>
                  <Link to={`/users/${currentUser.username}`} className={styles.hasIcon + ' ' + styles.user}>
                    {
                      currentUser.avatar_url ?
                        <Avatar className={styles.avatar} src={currentUser.avatar_url + '?x-oss-process=style/thumb_s'} size={24} />
                        :
                        <Avatar className={styles.avatar} icon="user" size={24} />
                    }
                    <span className={styles.username}>{currentUser.nickname}</span>
                  </Link>
                </li>
              </Dropdown>

            </ul>
            :
            <ul key="login">

              <li className={styles.search}>
                <GlobalHeaderSearch/>
              </li>

              <li>
                <Button className={styles.userBtn} onClick={ () => this.setUserModal(true, '1') }>
                  <FormattedMessage id="menu.user.login"/>
                </Button>
              </li>

              <li>
                <Button className={styles.userBtn} type="primary" onClick={ () => this.setUserModal(true, '2') }>
                  <FormattedMessage id="menu.user.register"/>
                </Button>
              </li>

            </ul>
        }

        <UserSignModal/>

      </div>
    )

  }

}
