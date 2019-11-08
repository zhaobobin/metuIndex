import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import styles from './HomeCricle.less'

@connect(state => ({
  global: state.global,
}))
export default class HomeCricle extends React.Component{

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      url: '/cricles',
    }
  }

  render(){

    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <h1><FormattedMessage id="home.cricle.title"/></h1>
        </div>

        <div className={styles.body}>

        </div>

      </div>
    )
  }

}
