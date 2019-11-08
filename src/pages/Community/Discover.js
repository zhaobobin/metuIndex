/**
 * Discover
 * 图片photo、视频video、影集album、图文graphic
 */
import React from 'react';
import { Link } from 'dva/router';
import { Row, Col, Affix, Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getUrlParams } from '@/utils/utils'
import styles from './Discover.less';

import Graphic from './Graphic'
import PhotoLayout from './PhotoLayout'

export default class Discover extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  render() {

    const params = getUrlParams();
    const tab = params.t || 'popular';

    const queryOption = {
      category: tab,
      per_page: 6,                 //每页数量
    };

    const menu = [
      { key: "popular", id: "menu.community.discover.popular", name: "热门" },
      { key: "editor", id: "menu.community.discover.editor", name: "推荐" },
      { key: "new", id: "menu.community.discover.new", name: "最新" },
      { key: "graphic", id: "menu.community.discover.graphic", name: "图文" },
    ]

    return (
      <div className={styles.container}>

        <Affix>
          <Menu
            mode="horizontal"
            selectedKeys={[tab]}
          >
            {
              menu.map((item, index) => (
                <Menu.Item key={item.key}>
                  <Link to={`/community/discover?t=${item.key}`}>
                    <FormattedMessage id={item.id}/>
                  </Link>
                </Menu.Item>
              ))
            }
          </Menu>
        </Affix>

        <div className={styles.content}>
          {
            tab === 'graphic' ?
              <Graphic/>
              :
              <PhotoLayout queryOption={queryOption}/>
          }
        </div>

      </div>
    )
  }

}
