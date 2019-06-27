/*
 * 文章列表查询 - 接收参数cateid
 * <ArticleListQuery/>
 */
import React from 'react';
import { connect } from 'dva';
import {Pagination, notification} from 'antd';
import {Storage} from '../../utils/utils';

import ArticleListShow from '~/blocks/Article/ArticleListShow'

@connect(state => ({
  global: state.global
}))
export default class ArticleListQuery extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      uid: this.props.uid || '',								                //用户id
      keyword: '',								                                              //筛选关键字
      currentPage: this.props.currentPage || 1,					//当前页数
      pageSize: Storage.get('metu-pageSize') || 10,			//每页数量

      total: 0,
      list: '',
    };
  }

  componentDidMount(){
    this.queryArticleList({
      params: {
        uid: this.state.uid,
        keyword: this.state.keyword,
      },
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    })
  }

  queryArticleList(params){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: 'api/ArticleList',
      payload: params,
      callback: (res) => {
        window.scrollTo(0, 0);
        this.ajaxFlag = true;
        let list = res.data.list;
        if(res.status === 1){
          for(let i in list){
            if(list[i].tags) list[i].tags = list[i].tags.split(',');
          }
          this.setState({
            total: res.data.total,
            list: list,
          })
        }else{
          notification.error({message: '提示', description: res.msg});
        }
      }
    });
  }

  //分页
  onChange = (current) => {
    this.queryArticleList({
      params: {
        uid: this.state.uid,
        keyword: this.state.keyword,
      },
      currentPage: current,
      pageSize: this.state.pageSize
    });
  };
  onShowSizeChange = (current, pageSize) => {
    this.queryArticleList({
      params: {
        uid: this.state.uid,
        keyword: this.state.keyword,
      },
      currentPage: current,
      pageSize: pageSize
    });
  };

  render(){

    const { list, total } = this.state;

    return(
      <div className="article-container">

        {
          list ?
            <ArticleListShow data={list} />
            :
            null
        }

        <Pagination
          defaultCurrent={1}
          total={total}
          hideOnSinglePage={true}
          showSizeChanger={true}
          showQuickJumper={true}
          onChange={this.onChange}
          onShowSizeChange={this.onShowSizeChange}
        />
      </div>
    )
  }

}
