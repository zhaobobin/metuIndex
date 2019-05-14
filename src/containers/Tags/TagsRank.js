/*
 * 标签排名查询
 * itemsPerPage： 总数量，默认10
 * <TagsRank itemsPerPage={10}/>
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './TagsRank.less';

@connect(state => ({
  global: state.tags,
}))
export default class TagsRank extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      list: '',
    };
  }

  componentDidMount(){
    this.queryTagsRank({itemsPerPage: this.props.itemsPerPage});
  }

  queryTagsRank(params){
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: 'api/TagsRank',
      payload: params,
      callback: (res) => {
        this.ajaxFlag = true;
        if(res.status === 1){
          this.setState({
            list: res.data,
          })
        }
      }
    });
  }

  render(){

    const {list} = this.state;
    //console.log(list)

    const RankList = list ?
      <div className={styles.list}>
        {
          list.map((topic, index) => (
            <Link to={`/tags/${topic.name}`} key={index}>
              {topic.name}
            </Link>
          ))
        }
      </div>
      :
      null;

    return(
      <div className={styles.tagsList}>
        <h3>热门标签</h3>
        {RankList}
      </div>
    )
  }

}
