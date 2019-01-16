/**
 * 发布
 */
import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import styles from './Publish.less';

import ArticleEditor from '~/components/Article/ArticleEditor';
import PublishRight from './PublishRight';

@connect(state => ({
  global: state.global
}))
export default class Publish extends React.Component {

  render(){

    const { global } = this.props;
    const modelType = this.props.match.params.modelType;

    //循环当前模型的分类列表
    let currentCate = [],
      category = global.category;
    for(let i in category){
      if(category[i].model.type === modelType) currentCate.push(category[i])
    }

    return(
      <div className={styles.publish}>
        {
          global.isAuth ?
            <div className={styles.container}>
              <div className={styles.left}>
                {
                  modelType === 'article' ?
                    <ArticleEditor/>
                    :
                    null
                }
              </div>
              <PublishRight modelType={modelType} category={currentCate}/>
            </div>
            :
            <Redirect to="/" />
        }
      </div>
    )
  }

}
