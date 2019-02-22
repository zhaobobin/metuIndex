/*
 * 相册列表 - 无限加载查询
 * <PhotosListQuery />
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Row, Col, notification} from 'antd';
import {Storage} from '~/utils/utils';
import InfiniteScroll from 'react-infinite-scroller';			//加载更多

import PhotoListGallery from '~/components/Photo/PhotoListGallery';

function getImgSize(url){
  let img = new Image();
  img.src = url;
  return {
    width: img.width,
    height: img.height
  }
}

@connect(state => ({
  global: state.global
}))
export default class PhotosListQuery extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

      params: {
        keyword: this.props.keyword || '',
        tag: this.props.tag || '',
        uid: this.props.uid || '',								                      //用户id
      },

      currentPage: this.props.currentPage || 1,					      //当前页数
      itemsPerPage: this.props.itemsPerPage || 10,			      //每页数量
      maxQueryPage: this.props.maxQueryPage || undefined,    //最大查询页数，默认undefined
      initializing: 1,

      loading: true,
      list: [],
      total: 0,
      hasMore: true
    };
  }

  componentDidMount(){
    this.queryPhotoList({
      params: this.state.params,
      currentPage: this.state.currentPage,
      pageSize: this.state.itemsPerPage
    })
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.keyword !== this.state.params.keyword) {
      this.queryPhotoList({
        clearList: true,
        params: {
          ...this.state.params,
          keyword: nextProps.keyword,
        },
        currentPage: 1,
        pageSize: this.state.itemsPerPage
      });
    }
  }

  queryPhotoList(query){

    let list = query.clearList ? [] : this.state.list;

    this.props.dispatch({
      type: 'global/post',
      url: 'api/PhotosList',
      payload: query,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.status === 1){
          this.setState({
            loading: false,
            params: query.params,
            currentPage: this.state.currentPage + 1,
            list: list.concat(res.data.list),
            total: res.data.total,
            hasMore: res.data.hasMore
          })
        }else{
          notification.error({message: '提示', description: res.msg});
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

    let _this = this;
    setTimeout(function(){
      _this.queryPhotoList({
        params: _this.state.params,
        currentPage: _this.state.currentPage,
        pageSize: _this.state.itemsPerPage
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
