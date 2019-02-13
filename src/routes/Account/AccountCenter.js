import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs } from 'antd';
import { ENV, Storage } from '~/utils/utils';
import styles from './AccountCenter.less';

import AccountCenterBanner from '~/components/Account/AccountCenterBanner';
import PhotoListMasonry from '~/components/Photo/PhotoListMasonry';
import PhotoListQuery from '~/components/Photo/PhotoListQuery';
import AlbumListQuery from '~/components/Photo/AlbumListQuery';
import ArticleListQuery from '~/components/Article/ArticleListQuery'
import AccountAbout from '~/components/Account/AccountAbout'

const TabPane = Tabs.TabPane;

@connect(state => ({
  global: state.global,
  oss: state.oss,
}))

export default class AccountCenter extends PureComponent {

  state = {
    username: this.props.match.params.username,
    detail: '',
    tabKey: Storage.get('metuIndex-UserCenterKey') ? Storage.get('metuIndex-UserCenterKey') : '1'
  };

  componentDidMount(){
    let username = this.props.match.params.username;
    this.queryUserDetail(username);
    document.title = '照片 - 用户中心' + " - " + ENV.appname;
  }

  queryUserDetail(username){
    this.props.dispatch({
      type: 'global/post',
      url: 'api/UserDetail',
      payload: {
        username: username
      },
      callback: (res) => {
        if(res.status === 1){
          this.setState({detail: res.data})
        }
      }
    });
  }

  handleTab = (key) => {
    switch(key){
      case "1":
        document.title = '照片 - 用户中心' + " - " + ENV.appname;
        break;
      case "2":
        document.title = '相册 - 用户中心' + " - " + ENV.appname;
        break;
      case "3":
        document.title = '文章 - 用户中心' + " - " + ENV.appname;
        break;
      case "4":
        document.title = '喜欢 - 用户中心' + " - " + ENV.appname;
        break;
      case "5":
        document.title = '收藏 - 用户中心' + " - " + ENV.appname;
        break;
      case "6":
        document.title = '关于 - 用户中心' + " - " + ENV.appname;
        break;
    }
    Storage.set('metuIndex-UserCenterKey', key);
    this.setState({tabKey: key})
    //this.forceUpdate();                             //更新当前视图
  };

  render(){

    const {tabKey, detail} = this.state;

    const queryOption = {
      itemsPerPage: 12,                 //每页数量
      maxQueryPage: 2,                  //最大页数
    };

    return(

      <div className={styles.userCenter}>

        {
          detail ?
            <AccountCenterBanner detail={detail} />
            :
            null
        }

        <Tabs defaultActiveKey={tabKey}
          animated={false}
          onChange={this.handleTab}
        >

          <TabPane tab="照片" key="1">
            {tabKey === '1' && detail ? <PhotoListQuery {...queryOption} category="userPhotoList" uid={detail._id}/> : null}
          </TabPane>

          <TabPane tab="相册" key="2">
            {tabKey === '2' && detail ? <AlbumListQuery {...queryOption} category="" uid={detail._id}/> : null}
          </TabPane>

          <TabPane tab="文章" key="3">
            <Row>
              <Col xs={0} sm={0} md={3} lg={5} />
              <Col xs={24} sm={24} md={18} lg={14}>
                {tabKey === '3' && detail ?
                  <Card bordered={true}>
                    <ArticleListQuery uid={detail._id}/>
                  </Card>
                  : null
                }
              </Col>
              <Col xs={0} sm={0} md={3} lg={5} />
            </Row>
          </TabPane>

          <TabPane tab="喜欢" key="4">
            {tabKey === '4' && detail ? <PhotoListMasonry data={detail.like} type="album" /> : null}
          </TabPane>

          <TabPane tab="收藏" key="5">
            {tabKey === '5' && detail ? <PhotoListMasonry data={detail.collect} type="album" /> : null}
          </TabPane>

          <TabPane tab="关于" key="6">
            <Row>
              <Col xs={0} sm={0} md={3} lg={5} />
              <Col xs={24} sm={24} md={18} lg={14}>
                {tabKey === '6' && detail ?
                  <Card bordered={true}>
                    <AccountAbout detail={detail} />
                  </Card>
                  : null
                }
              </Col>
              <Col xs={0} sm={0} md={3} lg={5} />
            </Row>
          </TabPane>

        </Tabs>

      </div>

    )
  }

}
