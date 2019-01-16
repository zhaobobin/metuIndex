/*
 * 相册列表 - 无限加载查询
 * <AlbumListQuery category={category} />
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Row, Col, notification} from 'antd';
import {Storage} from '~/utils/utils';
import InfiniteScroll from 'react-infinite-scroller';			//加载更多

import PhotoListGallery from '~/components/Photo/PhotoListGallery';
//import PhotoListMasonry from '~/components/Photo/PhotoListMasonry';
//import PhotoListGrid from '~/components/Photo/PhotoListGrid';

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
export default class AlbumListQuery extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

      params: {
        modelType: 'photo',
        category: this.props.category ? this.props.category : '',
        tag: this.props.tag ? this.props.tag : '',
        uid: this.props.uid ? this.props.uid : '',								                      //用户id
      },

      currentPage: this.props.currentPage ? this.props.currentPage : 1,					      //当前页数
      itemsPerPage: this.props.itemsPerPage ? this.props.itemsPerPage : 10,			      //每页数量
      maxQueryPage: this.props.maxQueryPage ? this.props.maxQueryPage : undefined,    //最大查询页数，默认undefined
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

    if(nextProps.category !== this.state.params.category) {
      this.queryPhotoList({
        clearList: true,
        params: {
          ...this.state.params,
          category: nextProps.category,
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
      url: 'api/ArticleList',
      payload: query,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.status === 1){
          this.setState({
            params: query.params,
            currentPage: this.state.currentPage + 1,
            loading: false,
            list: list.concat(res.data),
            total: res.total,
            hasMore: res.hasMore
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

    const { category, list, hasMore } = this.state;

    return(
      <div className="photo-container">
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={this.LoadMore}
          hasMore={hasMore}
        >
          <PhotoListGallery photos={list} category={category} type="album" />
        </InfiniteScroll>
      </div>
    )
  }

}
