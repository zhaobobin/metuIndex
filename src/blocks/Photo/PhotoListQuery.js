/*
 * 相册列表 - 无限加载查询
 * <PhotoListQuery />
 */
import React from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';			//加载更多

import PhotoListGallery from '@/blocks/Photo/PhotoListGallery';

@connect(state => ({
  global: state.global
}))
export default class PhotoListQuery extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

      filter: '',                               // 筛选条件
      page: this.props.page || 1,					      // 当前页数
      per_page: this.props.per_page || 10,			      // 每页数量
      maxQueryPage: this.props.maxQueryPage || undefined,    // 最大查询页数，默认undefined
      initializing: 1,

      url: '',
      loading: true,
      list: [],
      total: 0,
      hasMore: true
    };
  }

  componentDidMount(){
    this.queryPhotoList(this.props.url, {
      filter: this.props.filter,
      page: this.state.page,
      per_page: this.state.per_page
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.props.url || nextProps.filter !== this.props.filter) {
      this.queryPhotoList(nextProps.url, {
        clearList: true,
        filter: nextProps.filter,
        page: 1,
        per_page: this.state.per_page
      });
    }
  }

  queryPhotoList(url, query){

    let list = query.clearList ? [] : this.state.list;

    this.props.dispatch({
      type: 'global/request',
      url,
      method: 'GET',
      payload: query,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.code === 0){
          this.setState({
            url,
            loading: false,
            filter: query.filter,
            page: this.state.page + 1,
            list: list.concat(res.data.list),
            total: res.data.count,
            hasMore: res.data.hasMore
          })
        }else{
          notification.error({message: '提示', description: res.message});
        }
      }
    });
  }

  //Masonry布局 - 滚动加载更多
  LoadMore = (page) => {
    if(!page) return;
    if(this.state.maxQueryPage && page > this.state.maxQueryPage) return;
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    let {url} = this.state;
    let _this = this;
    setTimeout(function(){
      _this.queryPhotoList(url, {
        filter: _this.state.filter,
        page: _this.state.page,
        per_page: _this.state.per_page
      });
    }, 200)
  };

  render(){

    const { list, hasMore } = this.state;

    return(
      <div className="photo-container">
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={this.LoadMore}
          hasMore={hasMore}
        >
          <PhotoListGallery photos={list} type="photos" />
        </InfiniteScroll>
      </div>
    )
  }

}
