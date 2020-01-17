/**
 * 消息 - 气泡卡片
 */
import React from 'react';
import { Popover } from 'antd';
import MessagesPopoverContent from '@/blocks/Messages/MessagesPopoverContent';

export default class MessagesPopover extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      visible: false,
    }
  }

  changeMessageVisible = visible => {
    this.setState({
      visible
    });
  };

  render(){

    const { visible } = this.state;

    return(
      <Popover
        title=""
        placement="bottom"
        trigger="click"
        arrowPointAtCenter
        visible={visible}
        content={<MessagesPopoverContent/>}
        onVisibleChange={this.changeMessageVisible}
      >
        {this.props.children}
      </Popover>
    )
  }

}
