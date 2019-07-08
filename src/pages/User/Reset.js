import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
//import styles from './index.less';

import PsdReset from '@/blocks/User/PsdReset'

@connect(state => ({
  global: state.global,
}))
export default class Reset extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  componentDidMount(){

  }

  // 找回密码回调
  resetCallback = () => {
    this.props.dispatch(routerRedux.push('/user/login'));
  };

  render(){

    const step = this.props.match.params.step;

    const style = {
      margin: '25px auto',
      padding: '30px',
      background: '#fff'
    };

    return(
      <div>

        <Row>
          <Col xs={1} sm={1} md={4} lg={6} />
          <Col xs={22} sm={22} md={16} lg={12}>

            <div style={style}>
              <PsdReset step={step} callback={this.resetCallback}/>
            </div>

          </Col>
          <Col xs={1} sm={1} md={4} lg={6} />
        </Row>

      </div>
    )
  }

}
