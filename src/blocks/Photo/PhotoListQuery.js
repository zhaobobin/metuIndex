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

      category: '',                               // 分类
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
      category: this.props.category || '',
      page: this.state.page,
      per_page: this.state.per_page
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.props.url || nextProps.category !== this.props.category) {
      this.queryPhotoList(nextProps.url, {
        clearList: true,
        category: nextProps.category || '',
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
        setTimeout(() => { this.ajaxFlag = true }, 500)
        if(res.code === 0){
          this.setState({
            url,
            loading: false,
            category: query.category,
            page: this.state.page + 1,
            list: list.concat(res.data.list),
            total: res.data.count,
            hasMore: res.data.hasMore
          });
          if(this.props.callback) this.props.callback(res.data.count);
        }else{
          notification.error({message: '提示', description: res.message});
        }
      }
    });
  }

  //Masonry布局 - 滚动加载更多
  LoadMore = (page) => {

    if(!page) return;
    let {url, category, per_page, hasMore} = this.state;

    if(!url || !hasMore) return;
    if(this.state.maxQueryPage && page > this.state.maxQueryPage) return;

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let _this = this;
    setTimeout(function(){
      _this.queryPhotoList(url, {
        category,
        page: page + 1,
        per_page
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
