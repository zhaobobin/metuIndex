/*
 * 文章排名查询
 * category：分类
 * itemsPerPage： 总数量，默认10
 * <ArticleRank itemsPerPage={10}/>
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon, notification } from 'antd';
import Moment from 'moment';
// import { ENV, Storage } from '@/utils';

import styles from './ArticleRank.less';

@connect(state => ({
  global: state.global,
}))
export default class ArticleRank extends PureComponent {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      list: '',
    };
  }

  componentDidMount(){
    this.queryArticleRank(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.category !== this.props.category) this.queryArticleRank(nextProps);
  }

  queryArticleRank(props){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let params = {
      category: props.category ? props.category : '',
      parent: props.parent ? props.parent : '',
      pageSize: props.pageSize ? props.pageSize : 10
    };

    this.props.dispatch({
      type: 'global/request',
      url: '/api/ArticleRank',
      method: 'POST',
      payload: params,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.code === 0){
          this.setState({
            list: res.data,
          })
        }else{
          notification.error({message: '提示', description: res.message});
        }
      }
    });
  }

  render(){

    const {list} = this.state;
    //console.log(list)

    const RankList = list ?
      <ul className={styles.list}>
        {
          list.map((topic, index) => (
            <li className={styles.item} key={index}>
              <Link to={`/course/${topic._id}/${topic.title}-by-${topic.author.nickname}`}>
                <strong className={styles.title}>{topic.title}</strong>
                <p className={styles.desc}>{topic.description}</p>
                <p className={styles.info}>
                  <span><Icon type="user" /> {topic.author.nickname}</span>
                  <span><Icon type="clock-circle-o" /> {Moment(topic.createtime).format('YYYY-MM-DD')}</span>
                  <span><Icon type="eye-o" /> {topic.views}</span>
                  <span><Icon type="message" /> {topic.comments.length}</span>
                </p>
              </Link>
            </li>
          ))
        }
      </ul>
      :
      null;

    return(
      <div className={styles.rankList}>
        <h3>推荐阅读</h3>
        {RankList}
      </div>
    )
  }

}
