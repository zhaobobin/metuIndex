/**
 * loading
 */
import { Spin } from 'antd';

export default function Loading ({padding = 200, delay = 100}) {

  const style = {
    padding,
    textAlign: 'center'
  };

  return(
    <div style={style}>
      <Spin size="large" delay={delay}/>
    </div>
  )
};
