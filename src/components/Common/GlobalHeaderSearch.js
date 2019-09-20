/**
 * 导航 - 搜索
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Input, Icon } from 'antd';
import styles from './GlobalHeaderSearch.less'

const { Search } = Input;

@connect(state => ({
  global: state.global
}))
export default class GlobalHeaderSearch extends React.Component {

  constructor(props){
    super(props);
    this.value = '';
    this.state = {
      show: false,
      value: '',
    }
  }

  show = () => {
    this.setState({
      show: true,
    })
  }

  hide = () => {
    if (this.value) return;
    this.setState({
      show: false,
    })
  }

  onCHange = (e) => {
    let value = e.target.value;
    this.value = value.replace(/(^\s*)|(\s*$)/g, ""); // 去除两端空格
  }

  onSearch = (value) => {
    if(!this.value) return;
    // value = value.replace(/(^\s*)|(\s*$)/g, ""); // 去除两端空格
    const keyword = encodeURIComponent(this.value);
    this.props.dispatch(routerRedux.push(`/search?type=content&q=${keyword}`));
  }

  render(){

    const { show } = this.state;

    return(
      <div className={styles.search}>
        {
          show ?
            <Search
              autoFocus
              placeholder="搜索"
              onChange={this.onCHange}
              onSearch={this.onSearch}
              onBlur={this.hide}
            />
            :
            <span className={styles.icon}>
              <Icon type="search" onClick={this.show} />
            </span>
        }
      </div>
    )
  }

}
