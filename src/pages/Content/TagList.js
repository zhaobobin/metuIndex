/*
 * 标签文章列表
 * */
import React from "react";
import { Link } from "dva/router";
import { Affix, Menu } from "antd";
import { FormattedMessage } from "react-intl";
import { getUrlParams } from "@/utils/utils";
import styles from "./TagList.less";

import TagsArticleQuery from "@/containers/Tags/TagsArticleQuery";

export default class TagList extends React.Component {
  state = {
    tag: this.props.match.params.tag,
    total: 0,
  };

  handleTab = (key) => {
    this.setState({ tabKey: key });
  };

  queryResult = (total) => {
    this.setState({ total: total });
  };

  renderContent = (tab) => {
    console.log(tab)
    const { tag } = this.state;
    if (tab === "popular") {
      return (
        <TagsArticleQuery
          tag={tag}
          sort={{ views: -1 }}
          callback={this.queryResult}
        />
      );
    }
    if (tab === "new") {
      return (
        <TagsArticleQuery
          tag={tag}
          sort={{ _id: -1 }}
          callback={this.queryResult}
        />
      );
    }
    return null;
  };

  render() {
    const { tag, total } = this.state;
    const params = getUrlParams();
    const tab = params.t || "popular";

    const menu = [
      { key: "popular", id: "menu.community.discover.popular", name: "热门" },
      { key: "new", id: "menu.community.discover.editor", name: "最新" },
    ];

    return (
      <div className={styles.tagArticle}>
        <div className={styles.head}>
          <h1>{tag}</h1>
          <span className={styles.total}>{total} 组作品</span>
        </div>

        <Affix>
          <Menu mode="horizontal" selectedKeys={[tab]}>
            {menu.map((item) => (
              <Menu.Item key={item.key}>
                <Link to={`/tags/${tag}?t=${item.key}`}>
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
