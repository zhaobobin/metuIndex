/**
 * 消息列表
 */
import React from 'react';
import { Redirect } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon } from 'antd'
import styles from './MessagesList.less'

@connect(state => ({
  global: state.global
}))
export default class MessageList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      type: '',
      list: '',
      count: 0,
    }
  }

  componentDidMount(){
    this.refresh(this.props.type);
  }

  // UNSAFE_componentWillReceiveProps(nextProps){
  //   if(nextProps.type !== this.props.type){
  //     this.refresh(nextProps.type);
  //   }
  // }

  queryMessagesList(type, list){

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;
    // console.log(type)

    this.props.dispatch({
      type: 'global/request',
      url: `/messages?type=${type}`,
      method: 'GET',
      payload: {},
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === 0){
          this.setState({
            type,
            list: list.concat(res.data.list),
            count: res.data.count,
          })
        }
      }
    })

  }

  refresh = (type) => {
    let list = [];
    this.queryMessagesList(type, list)
  }

  loadMore = (type) => {
    let list = this.state.list;
    this.queryMessagesList(type, list)
  }

  render(){

    const { currentUser } = this.props.global;

    return(
      <div className={styles.container}>

        MessageList

      </div>
    )
  }
}
