/**
 * 发布、编辑
 */
import React from "react";
import { Redirect } from "dva/router";
import { connect } from "dva";
import { notification } from "antd";
import { goBack } from "@/utils/utils";
import { ENV } from "@/utils";
import styles from "./Publish.less";

import LoadingBg from "@/components/Common/LoadingBg";
import PublishArticle from "./PublishArticle";
import PublishPhoto from "./PublishPhoto";

@connect((state) => ({
  global: state.global,
}))
export default class Publish extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      detail: null,
      loading: true,
    };
  }

  componentDidMount() {
    document.body.style["overflow"] = "hidden";
    const { publishType, id } = this.props.match.params;
    if (id) {
      this.queryDetail(publishType, id);
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    document.body.style["overflow"] = "auto";
  }

  queryDetail = (publishType, id) => {
    const url = publishType === "photo" ? `/photos/${id}` : `/articles/${id}`;
    this.props.dispatch({
      type: "global/request",
      url,
      method: "GET",
      payload: {},
      callback: (res) => {
        if (res.code === 0) {
          let data = res.data;
          document.title = `${data.title} - ${data.author.nickname} - ${ENV.info.appname}`;
          if (data.tags && typeof data.tags === "string") {
            data.tags = data.tags.split(",");
          }
          this.props.dispatch({
            type: publishType === "photo" ? "publish/savePhoto" : "publish/saveArticle",
            payload: data,
          });
          this.setState({
            loading: false,
          });
        } else {
          notification.error({ message: "提示", description: res.message });
          goBack();
        }
      },
    });
  };

  render() {
    const { global } = this.props;
    const { publishType, id } = this.props.match.params;
    const { loading } = this.state;
    if (loading) {
      return (
        <LoadingBg
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
      );
    }
    return (
      <div className={styles.publish}>
        {global.isAuth ? (
          publishType === "article" ? (
            <PublishArticle id={id} />
          ) : (
            <PublishPhoto id={id} />
          )
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}
