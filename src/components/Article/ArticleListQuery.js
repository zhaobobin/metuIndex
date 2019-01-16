/*
 * 文章列表查询 - 接收参数cateid
 * category：分类
 * catedir：分类路径
 * <ArticleListQuery category={category} catedir={catedir}/>
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Pagination, notification} from 'antd';
import {Storage} from '../../utils/utils';

import ArticleListShow from './ArticleListShow'

@connect(state => ({
  article: state.article
}))
export default class ArticleListQuery extends PureComponent {

  state = {
    modelType: 'article',

    uid: this.props.uid ? this.props.uid : '',								                //用户id
    category: this.props.category ? this.props.category : '',								  //分类id
    parent: this.props.parent ? this.props.parent : '',								        //父级分类
    currentPage: this.props.currentPage ? this.props.currentPage : 1,					//当前页数
    pageSize: Storage.get('metu-pageSize') ? Storage.get('metu-pageSize') : 10,			//每页数量

    total: 0,
    list: '',
  };

  componentDidMount(){
    Storage.set('metu-ajaxFlag', true);
    this.queryArticleList({
      params: {
        modelType: this.state.modelType,
        uid: this.state.uid,
        category: this.state.category,
        parent: this.state.parent
      },
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    })
  }

  queryArticleList(params){
    if(!Storage.get('metu-ajaxFlag')) return;
    Storage.set('metu-ajaxFlag', false);

    this.props.dispatch({
      type: 'article/list',
      payload: params,
      callback: (res) => {
        window.scrollTo(0, 0);
        Storage.set('metu-ajaxFlag', true);
        if(res.status === 1){
          for(let i in res.data){
            if(res.data[i].tags) res.data[i].tags = res.data[i].tags.split(',');
          }
          this.setState({
            total: res.total,
            list: res.data,
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
        modelType: this.state.modelType,
        uid: this.state.uid,
        category: this.state.category,
        parent: this.state.parent
      },
      currentPage: current,
      pageSize: this.state.pageSize
    });
  };
  onShowSizeChange = (current, pageSize) => {
    this.queryArticleList({
      params: {
        modelType: this.state.modelType,
        uid: this.state.uid,
        category: this.state.category,
        parent: this.state.parent
      },
      currentPage: current,
      pageSize: pageSize
    });
  };

  render(){

    const { list, total, pageSize } = this.state;
    //console.log(list)

    return(
      <div className="article-container">

        {
          list ?
            <ArticleListShow data={list} />
            : null
        }

        <Pagination defaultCurrent={1}
          total={total}
          showSizeChanger
          showQuickJumper
          onChange={this.onChange}
          onShowSizeChange={this.onShowSizeChange}
        />
      </div>
    )
  }

}
