import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import styles from './HomeQuestion.less'

@connect(state => ({
  global: state.global,
}))
export default class HomeQuestion extends React.Component{

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
          <h1><FormattedMessage id="home.question.title"/></h1>
        </div>

        <div className={styles.body}>

        </div>

      </div>
    )
  }

}
