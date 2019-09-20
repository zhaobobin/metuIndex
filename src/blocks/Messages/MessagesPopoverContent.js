/**
 * 消息 - 内容：点赞、评论、关注、作品
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon, Tabs, Popover } from 'antd';
import styles from './MessagesPopoverContent.less';

import MessagesList from '@/blocks/Messages/MessagesList'

const { TabPane } = Tabs;

@connect(state => ({
  global: state.global
}))
export default class MessagesPopoverContent extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      tabKey: '0',
      tabs: [
        {
          type: 'favor',
          label: '点赞',
        },
        {
          type: 'comment',
          label: '评论',
        },
        {
          type: 'follow',
          label: '关注',
        },
        {
          type: 'collect',
          label: '收藏',
        },
        {
          type: 'mail',
          label: '私信',
        },
        {
          type: 'notify',
          label: '通知',
        },
      ]
    }
  }

  onChangeTab = (key) => {
    this.setState({
      tabKey: key
    })
  }

  render(){

    const { tabKey, tabs } = this.state;

    return(
      <div className={styles.container}>

        <Tabs
          defaultActiveKey={tabKey}
          // tabPosition="left"
          animated={{ tabPane: false }}
          onChange={this.onChangeTab}
        >
          {
            tabs.map((item, index) => (
              <TabPane tab={item.label} key={index}>
                <div className={styles.content}>
                  {
                    item.type === tabs[tabKey].type ?
                      <MessagesList type={tabs[tabKey].type}/>
                      :
                      null
                  }
                </div>
              </TabPane>
            ))
          }
        </Tabs>

        <div className={styles.foot}>
          <Link to="/settings/message" className={styles.settings}>
            <Icon type="setting" />
            <span>设置</span>
          </Link>
          <Link to={`/messages/${tabs[tabKey].type}`} className={styles.all}>
            <span>查看全部{tabs[tabKey].label}</span>
          </Link>
        </div>

      </div>
    )
  }

}
