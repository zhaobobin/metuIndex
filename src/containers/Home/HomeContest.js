import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import styles from './HomeContest.less'

@connect(state => ({
  global: state.global,
}))
export default class HomeContest extends React.Component{

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      url: '/questions',
    }
  }

  render(){

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <h1><FormattedMessage id="home.contest.title"/></h1>
          <p><FormattedMessage id="home.contest.desc"/></p>
        </div>

        <div className={styles.body}>

        </div>

      </div>
    )
  }

}
