import React from 'react';
import { connect } from 'dva';
//import styles from './index.less';

@connect(state => ({
  global: state.global,
}))
export default class Bxzq extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  componentsDidMount(){

  }

  render(){
    return(
      <div>
        变现专区
      </div>
    )
  }

}
