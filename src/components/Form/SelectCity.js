/**
 *	选择城市
 */
import React, { PureComponent } from 'react';
import {Cascader} from 'antd';
import options from './cascader-address-options';

export default class SelectCity extends PureComponent {

  render(){

    const city = this.props.city ? this.props.city.split(" - ") : [];                //默认城市

    return (

      <Cascader
        options={options}
        defaultValue={city}
        onChange={this.props.handleSelectCity}
        displayRender={label => label.join(' - ')}
        placeholder="请选择地区"
      />

    )

  }

}
