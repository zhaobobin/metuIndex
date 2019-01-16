import React from 'react';
import { Button } from 'antd'
import styles from './CusButton.less'

export default function CusButton(props) {

  const {size} = props;

  let btnSize;
  switch(size){
    case "small":
      btnSize = styles.cusButtonSmall;
      break;
    case "large":
      btnSize = styles.cusButtonLarge;
      break;
    default:
      btnSize = styles.cusButtonDefault;
      break;
  }

  return(
    <Button
      {...props}
      className={`${btnSize} ${props.className}`}
      style={props.style}
    >
      {props.children}
    </Button>
  )

}
