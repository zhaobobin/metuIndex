/*
 * 器材详情 - 品牌详情、设备详情
 */
import React, { PureComponent } from 'react';
import styles from './Equipment.less';

export default class EquipmentDetail extends PureComponent {

  state = {
    keyword: this.props.keyword ? this.props.keyword : null,
    detail: ''
  };

  // componentDidMount(){
  //   let {keyword} = this.state;
  //   console.log(keyword)
  // }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.keyword !== this.state.keyword) {
      this.setState({keyword: nextProps.keyword})
    }
  }

  render(){

    // const {detail} = this.state;

    return(

      <div className={styles.container}>

        设备详情

      </div>

    )

  }

}
