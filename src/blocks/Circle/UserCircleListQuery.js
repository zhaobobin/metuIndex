import React from 'react';
import { connect } from 'dva';
import { Row, Col, notification } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';			//加载更多
import CircleListItem from '@/containers/Circle/CircleListItem'

@connect(state => ({
  global: state.global,
}))
export default class UserCircleListQuery extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

      page: this.props.page || 1,					      // 当前页数
      per_page: this.props.per_page || 12,			      // 每页数量
      initializing: 1,

      url: '',
      loading: true,
      list: [],
      total: 0,
      hasMore: true
    };
  }

  componentDidMount(){
    this.queryCircleList(this.props.userId, {
      page: this.state.page,
      per_page: this.state.per_page
    })
  }

  queryCircleList(userId, query){
    
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let list = query.clearList ? [] : this.state.list;

    this.props.dispatch({
      type: 'global/request',
      url: `/users/${userId}/circles`,
      method: 'GET',
      payload: query,
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === 0){
          this.setState({
            loading: false,
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
    let {per_page, hasMore} = this.state;

    if(!hasMore) return;
    if(this.state.maxQueryPage && page > this.state.maxQueryPage) return;

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let _this = this;
    setTimeout(function(){
      _this.queryCircleList({
        page: page + 1,
        per_page
      });
    }, 200)
  };

  render(){

    const { list, hasMore } = this.state;

    return(

      <Row>
        <Col xs={0} sm={0} md={3} lg={5} />
        <Col xs={24} sm={24} md={18} lg={14}>

          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.LoadMore}
            hasMore={hasMore}
          >
            <Row gutter={20} style={{ marginBottom: '20px' }}>
              {
                list.map((item, index) => (
                  <Col xs={24} sm={24} md={12} lg={8} key={index}>
                    <CircleListItem item={item}/>
                  </Col>
                ))
              }
            </Row>
          </InfiniteScroll>

        </Col>
        <Col xs={0} sm={0} md={3} lg={5} />
      </Row>

    )
  }

}
