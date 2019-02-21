/**
 * 发布
 */
import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import styles from './Publish.less';

import PublishArticle from './PublishArticle';
import PublishPhoto from './PublishPhoto';

@connect(state => ({
  global: state.global
}))
export default class Publish extends React.Component {

  componentDidMount(){
    document.body.style['overflow'] = 'hidden'
  }

  componentWillUnmount(){
    document.body.style['overflow'] = 'auto'
  }

  render(){

    const { global } = this.props;
    const publishType = this.props.match.params.publishType;

    return(
      <div className={styles.publish}>
        {
          global.isAuth ?
            publishType === 'article' ?
              <PublishArticle/>
              :
              <PublishPhoto/>
            :
            <Redirect to="/" />
        }
      </div>
    )
  }

}
