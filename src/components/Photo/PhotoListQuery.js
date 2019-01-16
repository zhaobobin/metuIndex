/*
 * 图片列表 - 对应oss存储，无限加载查询
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Row, Col, notification} from 'antd';
import {Storage} from '~/utils/utils';

import PhotoListGallery from '~/components/Photo/PhotoListGallery';
//import PhotoListMasonry from '~/components/Photo/PhotoListMasonry';
//import PhotoListGrid from '~/components/Photo/PhotoListGrid';

import InfiniteScroll from 'react-infinite-scroller';			//加载更多

@connect(state => ({
  photo: state.photo
}))
export default class PhotoListQuery extends PureComponent {

  state = {

    params: {
      modelType: 'photo',                                                             //文章模型类型
      category: this.props.category ? this.props.category : '',
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

  componentDidMount(){
    Storage.set('metu-ajaxFlag', true);
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
      type: 'photo/list',
      payload: query,
      callback: (res) => {
        Storage.set('metu-ajaxFlag', true);
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

  //加载更多
  LoadMore = (page) => {
    if(!page) return;
    if(this.state.maxQueryPage && page > this.state.maxQueryPage) return;
    if(!Storage.get('metu-ajaxFlag')) return;
    Storage.set('metu-ajaxFlag', false);

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
        {
          list.length > 0 ?
            <InfiniteScroll
              pageStart={0}
              initialLoad={false}
              loadMore={this.LoadMore}
              hasMore={hasMore}
            >
              <PhotoListGallery photos={list} category={category} type="photo" />
            </InfiniteScroll>
            :
            null
        }
      </div>
    )
  }

}
