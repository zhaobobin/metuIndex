import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs } from 'antd';
import styles from './Home.less';

import PhotoWelcome from '~/components/Photo/PhotoWelcome';
import AlbumListQuery from '~/components/Photo/AlbumListQuery';


const TabPane = Tabs.TabPane;

@connect(state => ({
  global: state.global,
  fetch: state.fetch,
}))
export default class Home extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      key: 'popular',
    }
  }

  handleTab = (key) => {
    this.setState({key})
  };

  render(){

    const {key} = this.state;
    const {category} = this.props.global;

    let currentCate = key;
    for(let i in category){
      if(key === category[i].name){
        currentCate = category[i]._id
      }
    }

    const queryOption = {
      category: currentCate,
      itemsPerPage: 12,                 //每页数量
      maxQueryPage: 2,                  //最大页数
    };

    return(
      <div className={styles.home}>

        <PhotoWelcome />

        <div className={styles.title}>
          <h1>The top photos, chosen by you</h1>
          <p>Discover what’s trending according to photographers around the world.</p>
        </div>

        {/*<div className={styles.photoList}>*/}
          {/*<Tabs defaultActiveKey={key}*/}
                {/*animated={false}*/}
                {/*onChange={this.handleTab}*/}
          {/*>*/}

            {/*<TabPane tab="热门" key="popular">*/}
              {/*{key === 'popular' ? <AlbumListQuery {...queryOption} /> : null}*/}
            {/*</TabPane>*/}

            {/*<TabPane tab="推荐" key="editor">*/}
              {/*{key === 'editor' ? <AlbumListQuery {...queryOption} /> : null}*/}
            {/*</TabPane>*/}

            {/*<TabPane tab="最新" key="new">*/}
              {/*{key === 'new' ? <AlbumListQuery {...queryOption} /> : null}*/}
            {/*</TabPane>*/}

            {/*<TabPane tab="风光" key="风光">*/}
              {/*{key === '风光' ? <AlbumListQuery {...queryOption} /> : null}*/}
            {/*</TabPane>*/}

            {/*<TabPane tab="人像" key="人像">*/}
              {/*{key === '人像' ? <AlbumListQuery {...queryOption} /> : null}*/}
            {/*</TabPane>*/}

            {/*<TabPane tab="人文" key="人文">*/}
              {/*{key === '人文' ? <AlbumListQuery {...queryOption} /> : null}*/}
            {/*</TabPane>*/}

          {/*</Tabs>*/}
        {/*</div>*/}
      </div>
    )
  }

}
