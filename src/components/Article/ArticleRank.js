/*
 * 文章排名查询
 * category：分类
 * modelType：模型类型，默认article
 * itemsPerPage： 总数量，默认10
 * <ArticleRank modelType="article" itemsPerPage={10}/>
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Card, Icon, notification} from 'antd';
import Moment from 'moment';
import {Storage} from "../../utils/utils";

import styles from './ArticleRank.less';

@connect(state => ({
  article: state.article,
}))
export default class ArticleRank extends PureComponent {

  state = {
    list: '',
  };

  componentDidMount(){
    Storage.set('metu-rankFlag', true);
    this.queryArticleRank(this.props);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.category !== this.props.category) this.queryArticleRank(nextProps);
  }

  queryArticleRank(props){
    if(!Storage.get('metu-rankFlag')) return;
    Storage.set('metu-rankFlag', false);

    let params = {
      modelType: props.modelType ? props.modelType : 'article',
      category: props.category ? props.category : '',
      parent: props.parent ? props.parent : '',
      pageSize: props.pageSize ? props.pageSize : 10
    };

    this.props.dispatch({
      type: 'article/rank',
      payload: params,
      callback: (res) => {
        Storage.set('metu-rankFlag', true);
        if(res.status === 1){
          this.setState({
            list: res.data,
          })
        }else{
          notification.error({message: '提示', description: res.msg});
        }
      }
    });
  }

  render(){

    const {list} = this.state;
    //console.log(list)

    const RankList = list ?
      list.map((topic, index) => (
        <div className={styles.rankItem} key={index}>
          <Link to={`/${topic.category.catedir}/${topic._id}/${topic.title}-by-${topic.uid.nickname}`}>
            <strong className={styles.title}>{topic.title}</strong>
            <p className={styles.desc}>{topic.description}</p>
            <p className={styles.info}>
              <span><Icon type="user" /> {topic.uid.nickname}</span>
              <span><Icon type="clock-circle-o" /> {Moment(topic.createtime).format('YYYY-MM-DD')}</span>
              <span><Icon type="eye-o" /> {topic.views}</span>
              <span><Icon type="message" /> {topic.comments.length}</span>
            </p>
          </Link>
        </div>
      ))
      : null;

    return(
      <div className={styles.rankList}>
        {RankList}
      </div>
    )
  }

}
