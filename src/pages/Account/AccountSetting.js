import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './AccountSetting.less';

import AccountInfoSetting from '@/containers/Account/AccountInfoSetting'

const TabPane = Tabs.TabPane;

@connect(state => ({
  global: state.global
}))
export default class AccountSetting extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tabKey: '1'
    }
  }

  componentDidMount(){

  }

  handleTab = (key) => {
    this.setState({tabKey: key})
    //this.forceUpdate();                             //更新当前视图
  };

  render(){

    const tabKey = this.state.tabKey;

    const {isAuth} = this.props.global;

    return(
      <div className={styles.setting}>
        {
          isAuth ?
            <Tabs defaultActiveKey={tabKey}
                  animated={false}
                  onChange={this.handleTab}
            >
              <TabPane tab="用户信息" key="1">
                <AccountInfoSetting/>
              </TabPane>
              <TabPane tab="账户安全" key="2">基本信息</TabPane>
              <TabPane tab="个人偏好" key="3">基本信息</TabPane>
              <TabPane tab="社交账号" key="4">基本信息</TabPane>
            </Tabs>
            :
            <Redirect to="/" />
        }
      </div>
    )
  }

}
