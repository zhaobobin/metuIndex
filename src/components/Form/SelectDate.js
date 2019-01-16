/**
 *	选择日期
 */
import React, { PureComponent } from 'react';
import {DatePicker} from 'antd';

import Moment from 'moment'

export default class SelectDate extends PureComponent {


  render(){

    const date = this.props.date ? Moment.utc(this.props.date, 'YYYY-MM-DD') : null;  //utc转换时区

    return (

      <DatePicker
        defaultValue={date}
        onChange={this.props.handleSelectDate}
        style={{width: '100%'}}
        placeholder="请选择日期"
      />

    )

  }

}
