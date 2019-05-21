import React from 'react';

let timer;

export default class CountDown extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      count: null
    }
  }

  componentDidMount(){
    this.interval();
  }

  componentWillUnmount(){
    clearInterval(timer);
  }

  //倒计时
  interval(){
    let num = this.props.num;
    this.setState({count: num});
    timer = setInterval(() => {
      if(num === 1){
        clearInterval(timer);
        this.props.onEnd();
      }else{
        num--;
        this.setState({count: num});
      }
    }, 1000)
  }

  render(){
    return(
      <span>
        {this.state.count}
      </span>
    )
  }

}
