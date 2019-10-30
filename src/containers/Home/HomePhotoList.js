import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import styles from './HomePhotoList.less'

import PhotoListQuery from '@/blocks/Photo/PhotoListQuery';
const TabPane = Tabs.TabPane;

@connect(state => ({
  global: state.global,
}))
export default class HomePhotoList extends React.Component{

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      url: '/photos',
      keyword: 'popular',
    }
  }

  handleTab = (keyword) => {
    this.setState({keyword})
  };

  render(){

    const { url, keyword } = this.state;

    const queryOption = {
      keyword,
      per_page: 12,                 //每页数量
      maxQueryPage: 2,                  //最大页数
    };

    return(
      <div className={styles.photoList}>
        <Tabs
          defaultActiveKey={keyword}
          animated={false}
          onChange={this.handleTab}
        >

          <TabPane tab="热门" key="popular">
            {keyword === 'popular' ? <PhotoListQuery url={url} {...queryOption} /> : null}
          </TabPane>

          <TabPane tab="推荐" key="editor">
            {keyword === 'editor' ? <PhotoListQuery url={url} {...queryOption} /> : null}
          </TabPane>

          <TabPane tab="最新" key="new">
            {keyword === 'new' ? <PhotoListQuery url={url} {...queryOption} /> : null}
          </TabPane>

          <TabPane tab="风光" key="风光">
            {keyword === '风光' ? <PhotoListQuery url={url} {...queryOption} /> : null}
          </TabPane>

          <TabPane tab="人像" key="人像">
            {keyword === '人像' ? <PhotoListQuery url={url} {...queryOption} /> : null}
          </TabPane>

          <TabPane tab="人文" key="人文">
            {keyword === '人文' ? <PhotoListQuery url={url} {...queryOption} /> : null}
          </TabPane>

        </Tabs>
      </div>
    )
  }

}
