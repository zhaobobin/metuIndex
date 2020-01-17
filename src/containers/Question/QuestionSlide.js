/**
 * QuestionSlide
 */
import React from 'react';
import {connect} from 'dva'
import { Button } from 'antd';
import styles from './QuestionSlide.less';

import QuestionModal from './QuestionModal';
import SignAuth from '@/blocks/Auth/SignAuth';

@connect(state => ({
  global: state.global
}))
export default class QuestionSlide extends React.Component {

  publishQuestion = () => {
    if (!this.signAuth.check()) return false;
    this.questionModal.show();
  }

  signAuthCallback = (isAuth) => {
    if(isAuth) this.questionModal.show();
  }

  render(){
    return(
      <div className={styles.container}>

        <div className={styles.head}>
          <Button type="primary" onClick={this.publishQuestion}>提问</Button>
          <QuestionModal onRef={ref => this.questionModal = ref} />
          <SignAuth onRef={ref => this.signAuth = ref} callback={this.signAuthCallback} />
        </div>

      </div>
    )
  }

}
