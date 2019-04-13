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

  //查询拼图图片路径
  queryPintuImg(){
    let {mobile} = this.props;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/userRegister/getCheckImg',
      payload:{
        mobile: mobile
      },
      callback: (res) => {
        if(res && res.code === 0){

        }else{

        }
      }
    })
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
