/**
 * 拼图验证码
 * no [Number] 序列号
 * callback [Function] 返回 true 或 false
 */
import React from 'react'
import Pintu from './Pintu'

export default class PintuValidate extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      no: '',              //拼图初始化标志
    }
  }

  componentDidMount(){
    this.init();
    document.addEventListener("touchstart", this.getStart);
    document.addEventListener("touchmove", this.stopTouch, {passive:false});
  }

  componentWillUnmount(){
    document.removeEventListener("touchstart", this.getStart);
    document.removeEventListener("touchmove", this.stopTouch, {passive:false});
  }

  getStart = (e) => {
    this.startX = e.targetTouches[0].pageX;
    this.startY = e.targetTouches[0].pageY;
  }

  stopTouch = (e) => {
    const moveX = e.targetTouches[0].pageX;
    const moveY = e.targetTouches[0].pageY;
    if(Math.abs(moveX - this.startX) > Math.abs(moveY - this.startY)){
      e.preventDefault();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.no && nextProps.no !== this.props.no) {
      this.reset()
    }
  }

  //初始化
  init = () => {
    let _this = this;
    Pintu.init({
      el: document.getElementById('captcha'),
      onSuccess: function() {
        _this.result(true);
      },
      onFail: function() {
        _this.result(false);
      },
      onRefresh: function() {
        _this.result(false);
      },
    });
  };

  //重置拼图
  reset = () => {
    document.getElementById('captcha').innerHTML = '';
    this.init();
  };

  //拼图回调
  result = (res) => {
    this.props.callback(res)
  };

  render(){
    const width = document.body.clientWidth > 320 ? '320px' : '100%';
    return(
      <div className="pintu" style={{width: width, margin: 'auto', padding: '5px 0', overflow: 'hidden'}}>
        <div id="captcha"/>
      </div>
    )
  }

}
