import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { ENV } from '@/utils'
import styles from './UserSignModal.less';

import logo from '@/assets/logo.png'
import UserLogin from '@/blocks/User/UserLogin';
import UserRegister from '@/blocks/User/UserRegister';

@connect(state => ({
  global: state.global
}))
export default class UserSignModal extends React.Component {

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

  loginCallback = () => {
    this.setUserModal(false, '1');
  };

  registerCallback = () => {
    this.setUserModal(false, '2');
  };

  render(){

    const { signModalVisible, signTabKey } = this.props.global;

    return(
      <Modal
        title=""
        width="430px"
        footer={null}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        visible={signModalVisible}
        className={styles.userModal}
        onCancel={ () => this.setUserModal(false, "1") }
      >
        <div className={styles.content}>
          <div className={styles.head}>
            <img src={logo} alt="logo"/>
            <strong>{ENV.slogan}</strong>
          </div>
          <div className={styles.body}>
            {
              signTabKey === '1' ?
                <UserLogin showType="modal" callback={this.loginCallback}/>
                :
                <UserRegister showType="modal" callback={this.registerCallback}/>
            }
          </div>
        </div>
      </Modal>
    )
  }

}
