/**
 *	选择城市
 */
import React, { PureComponent } from 'react';
import {Cascader} from 'antd';
import options from './cascader-address-options';

export default class SelectCity extends PureComponent {

  render(){

    const { initValue, size } = this.props;
    const city = initValue ? initValue.split(" - ") : [];                //默认城市

    return (

      <Cascader
        size={size}
        options={options}
        defaultValue={city}
        onChange={this.props.callback}
        displayRender={label => label.join(' - ')}
        placeholder="请选择地区"
      />

    )

  }

}
