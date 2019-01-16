/*
 * 标签排名查询
 * itemsPerPage： 总数量，默认10
 * <TagsRank itemsPerPage={10}/>
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Card, Icon, notification} from 'antd';
import {Storage} from "../../utils/utils";

import styles from './TagsRank.less';

@connect(state => ({
  tags: state.tags,
}))
export default class TagsRank extends PureComponent {

  state = {
    list: '',
  };

  componentDidMount(){
    Storage.set('metu-tagsFlag', true);
    this.queryTagsRank({itemsPerPage: this.props.itemsPerPage});
  }

  queryTagsRank(params){
    if(!Storage.get('metu-tagsFlag')) return;
    Storage.set('metu-tagsFlag', false);

    this.props.dispatch({
      type: 'tags/rank',
      payload: params,
      callback: (res) => {
        Storage.set('metu-tagsFlag', true);
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
        <Link to={`/tags/${topic.name}`} key={index}>
          {topic.name}
        </Link>
      ))
      : null;

    return(
      <div className={styles.tagsList}>
        {RankList}
      </div>
    )
  }

}
