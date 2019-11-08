/*
 * 问题列表 - 无限加载查询
 * <QuestionListQuery />
 */
import React from 'react';
import { connect } from 'dva';
import { Empty, Skeleton, notification } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';			//加载更多

import QuestionListItem from './QuestionListItem'

@connect(state => ({
  global: state.global,
  question: state.question,
}))
export default class QuestionListQuery extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

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
    let { per_page } = this.props.question;
    this.queryPhotoList(this.props.url, {
      category: this.props.category,
      page: 1,
      per_page
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.props.url || nextProps.category !== this.props.category) {
      let { per_page } = this.props.question;
      this.queryPhotoList(nextProps.url, {
        category: nextProps.category,
        page: 1,
        per_page
      });
    }
  }

  queryPhotoList(url, query){
    this.props.dispatch({
      type: 'question/list',
      url,
      method: 'GET',
      payload: query,
    });
  }

  //Masonry布局 - 滚动加载更多
  LoadMore = (page) => {

    if(!page) return;
    let {url, category, per_page, hasMore} = this.props.question;
    if(!url || !hasMore) return;
    if(this.state.maxQueryPage && page > this.state.maxQueryPage) return;

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let _this = this;
    setTimeout(function(){
      _this.queryPhotoList(url, {
        category,
        page,
        per_page
      });
    }, 200)
  };

  render(){

    const { loading, list, hasMore } = this.props.question;

    return(
      <div className="question-container">
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={this.LoadMore}
          hasMore={hasMore}
        >
          <Skeleton active loading={loading}>
            {
              list.length > 0 ?
                list.map((item, index) => (
                  <QuestionListItem key={index} item={item} />
                ))
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          </Skeleton>
        </InfiniteScroll>
      </div>
    )
  }

}
