/*
 * 标签下相关文章列表查询 - 接收参数cateid
 * tag：标签名称
 * sort：排序
 * callback：回调
 * <TagsListQuery tag={tag} sort={{_id: -1}} />
 */
import React from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';			//加载更多

import PhotoListMasonry from '@/blocks/Photo/PhotoListMasonry'

@connect(state => ({
  global: state.global
}))
export default class TagsListQuery extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

      tag: this.props.tag ? this.props.tag : '',
      sort: this.props.sort ? this.props.sort : '',

      currentPage: this.props.currentPage ? this.props.currentPage : 1,					//当前页数
      pageSize: this.props.pageSize ? this.props.pageSize : 10,			            //每页数量
      initializing: 1,

      total: 0,
      list: '',
      hasMore: true
    };
  }

  componentDidMount(){
    this.queryTagsList({
      tag: this.state.tag,
      // sort: this.state.sort,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.tag !== this.props.tag){
      this.queryTagsList({
        tag: nextProps.tag,
        // sort: nextProps.sort,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize
      });
    }
  }

  queryTagsList(params){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/request',
      url: '/photos',
      method: 'GET',
      payload: params,
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500)
        if(res.code === 0){
          for(let i in res.data){
            if(res.data[i].tags) res.data[i].tags = res.data[i].tags.split(',');
          };
          this.props.callback(res.data.count);
          this.setState({
            total: res.data.count,
            list: res.data.list,
            hasMore: res.data.hasMore
          });
        }else{
          notification.error({message: '提示', description: res.message});
        }
      }
    });
  }

  //加载更多
  LoadMore = (page) => {
    if(!page) return;
    let _this = this;
    setTimeout(function(){
      _this.queryTagsList();
    }, 200)
  };

  render(){

    const { list, hasMore } = this.state;
    // console.log(list)

    return(
      <div className="tags-container">
        {
          list ?
            <InfiniteScroll
              pageStart={0}
              initialLoad={false}
              loadMore={this.LoadMore}
              hasMore={hasMore}
            >
              <PhotoListMasonry data={list} type="photos" />
            </InfiniteScroll>
            :
            null
        }
      </div>
    )
  }

}
