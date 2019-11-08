/**
 * Community
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Affix, Menu } from 'antd';
import styles from './_layout.less';

@connect(state => ({
  global: state.global,
}))
export default class _layout extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      pathname: this.props.location.pathname,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.state.pathname) {
      this.setState({ pathname: nextProps.location.pathname })
    }
  }

  render() {

    return (
      <div className={styles.container}>

        社区首页

      </div>
    )
  }

}
