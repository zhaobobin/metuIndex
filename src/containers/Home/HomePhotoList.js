import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
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
      category: 'popular',
    }
  }

  handleTab = (category) => {
    this.setState({category})
  };

  render(){

    const { url, category } = this.state;

    const queryOption = {
      category,
      per_page: 12,                 //每页数量
      maxQueryPage: 2,                  //最大页数
    };

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <h1><FormattedMessage id="home.photo.title"/></h1>
          <p><FormattedMessage id="home.photo.desc1"/></p>
          <p><FormattedMessage id="home.photo.desc2"/></p>
        </div>

        <div className={styles.body}>
          <Tabs
            defaultActiveKey={category}
            animated={false}
            onChange={this.handleTab}
          >

            <TabPane tab="热门" key="popular">
              {category === 'popular' ? <PhotoListQuery url={url} {...queryOption} /> : null}
            </TabPane>

            <TabPane tab="推荐" key="editor">
              {category === 'editor' ? <PhotoListQuery url={url} {...queryOption} /> : null}
            </TabPane>

            <TabPane tab="最新" key="new">
              {category === 'new' ? <PhotoListQuery url={url} {...queryOption} /> : null}
            </TabPane>

          </Tabs>
        </div>

      </div>
    )
  }

}
