/**
 * Discover
 * 图片photo、视频video、影集album、图文graphic
 */
import React from "react";
import { Link } from "dva/router";
import { Affix, Menu } from "antd";
import { FormattedMessage } from "react-intl";
import { getUrlParams } from "@/utils/utils";
import styles from "./Discover.less";

import Graphic from "./Graphic";
import PhotoLayout from "./PhotoLayout";
import TagLayout from "./TagLayout";

export default class Discover extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {};
  }

  renderContent = (tab) => {
    const queryOption = {
      category: tab,
      per_page: 12, //每页数量
    };
    if (tab === "graphic") {
      return <Graphic />;
    }
    if (tab === 'tag') {
      return <TagLayout />;
    }
    return <PhotoLayout queryOption={queryOption} />;
  };

  render() {
    const params = getUrlParams();
    const tab = params.t || "popular";

    const menu = [
      { key: "popular", id: "menu.community.discover.popular", name: "热门" },
      { key: "editor", id: "menu.community.discover.editor", name: "推荐" },
      { key: "new", id: "menu.community.discover.new", name: "新作" },
      { key: "graphic", id: "menu.community.discover.graphic", name: "图文" },
      { key: "set", id: "menu.community.discover.set", name: "影集" },
      { key: "story", id: "menu.community.discover.story", name: "专栏" },
      { key: "tag", id: "menu.community.discover.tag", name: "标签" },
    ];

    return (
      <div className={styles.container}>
        <Affix>
          <Menu mode="horizontal" selectedKeys={[tab]}>
            {menu.map(item => (
              <Menu.Item key={item.key}>
                <Link to={`/community/discover?t=${item.key}`}>
                  <FormattedMessage id={item.id} />
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Affix>

        <div className={styles.content}>{this.renderContent(tab)}</div>
      </div>
    );
  }
}
