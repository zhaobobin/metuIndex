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
    this.init()
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
    return(
      <div className="pintu" style={{width: '320px', margin: 'auto'}}>
        <div id="captcha"/>
      </div>
    )
  }

}
