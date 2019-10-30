/*
 * 文章列表查询 - 接收参数cateid
 * <ArticleListQuery url={url} query={quert} />
 */
import React from 'react';
import { connect } from 'dva';
import { Empty, Skeleton, Pagination } from 'antd';
import { ENV, Storage } from '@/utils';
import styles from './ArticleListQuery.less'

import ArticleListItem from '@/blocks/Article/ArticleListItem'

@connect(state => ({
  global: state.global
}))
export default class ArticleListQuery extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      total: 0,
      list: '',

      url: '',
      q: '',								              //筛选关键字
      page: 1,					//当前页数
      per_page: Storage.get(ENV.perPage) || 10,			//每页数量

    };
  }

  componentDidMount(){
    let {url} = this.props;
    this.queryArticleList(url, {
      q: this.state.q,
      page: this.state.page,
      per_page: this.state.per_page
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.url !== this.props.url || nextProps.keyword !== this.props.keyword){
      this.queryArticleList(nextProps.url, {
        q: this.state.q,
        page: this.state.page,
        per_page: this.state.per_page
      })
    }
  }

  queryArticleList(url, query){

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/request',
      url,
      method: 'GET',
      payload: query,
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        let list = res.data.list;
        if(res.code === 0){
          for(let i in list){
            if(list[i].tags) list[i].tags = list[i].tags.split(',');
          }
          this.setState({
            url,
            loading: false,
            total: res.data.count,
            list: list,
            page: query.page,
            per_page: query.per_page,
          })
        }
      }
    });
  }

  //分页
  onChange = (current) => {
    let {url} = this.state;
    this.queryArticleList(url, {
      q: this.state.q,
      page: current,
      per_page: this.state.per_page
    });
  };

  onShowSizeChange = (current, pageSize) => {
    let {url} = this.state;
    this.queryArticleList(url, {
      q: this.state.q,
      page: current,
      per_page: pageSize
    });
  };

  render(){

    const { loading, list, total } = this.state;

    return(
      <div className={styles.container}>

        <Skeleton active loading={loading}>
          {
            list.length > 0 ?
              list.map((item, index) => (
                <ArticleListItem key={index} item={item} />
              ))
              :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Skeleton>

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
