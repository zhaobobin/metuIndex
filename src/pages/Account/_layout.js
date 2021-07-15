import React from "react";
import { connect } from "dva";
import { Affix } from "antd";
import styles from "./_layout.less";

import AccountHeaderCover from "@/containers/Account/AccountHeaderCover";
import AccountHeaderInfo from "@/containers/Account/AccountHeaderInfo";
import AccountMenu from "@/containers/Account/AccountMenu";
import AccountContent from "@/containers/Account/AccountContent";

import RouteExtend from "@/components/Common/RouteExtend";
const Routes = RouteExtend("users");

@connect((state) => ({
  global: state.global,
}))
export default class _layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      username: "",
      detail: "",
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;
    this.queryUserDetail(username);
  }

  queryUserDetail(username) {
    this.props.dispatch({
      type: "global/userinfo",
      url: `/users/${username}`,
      payload: {},
    });
  }

  render() {
    const { profileUser } = this.props.global;

    return (
      <div className={styles.container}>
        {profileUser ? <AccountHeaderCover /> : null}

        {profileUser ? <AccountHeaderInfo /> : null}

        {profileUser ? (
          <Affix>
            <AccountMenu routes={Routes} username={profileUser.username} />
          </Affix>
        ) : null}

        {profileUser ? (
          <AccountContent routes={Routes} username={profileUser.username} />
        ) : null}
      </div>
    );
  }
}
