/**
 * ToastLoading
 */
import { Spin } from 'antd';

export default function ToastLoading () {

  const bgStyle = {width: '100%', height: '100%', position: 'fixed', zIndex: 999, background: 'rgba(0,0,0,.3)'};
  const iconStyle = {position: 'absolute', left: '50%', top: '50%', marginLeft: '-16px', marginTop: '-16px'};

  return(
    <div style={bgStyle}>
      <Spin size="large" delay={200} style={iconStyle} />
    </div>
  )
};
