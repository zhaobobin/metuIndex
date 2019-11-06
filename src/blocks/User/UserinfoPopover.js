import React from 'react';
import { connect } from 'dva';
import { Popover } from 'antd';

@connect(state => ({
  global: state.global,
}))
export default class UserinfoPopover extends React.Component {

  queryUserinfo = (user_id) => {

  }

  render(){

    const content = (
      <div>
        123
      </div>
    )

    return(
      <Popover content={content} trigger="hover">
        {this.props.children}
      </Popover>
    )
  }

}
