import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
//import styles from './index.less';

import UserRegister from '~/blocks/User/UserRegister';

@connect(state => ({
  global: state.global,
}))
export default class Register extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  componentsDidMount(){

  }

  // 注册回调
  registerCallback = () => {
    this.props.dispatch(routerRedux.push('/'));
  };

  render(){

    return(

      <div>

        <Row>
          <Col xs={0} sm={0} md={4} lg={6} />
          <Col xs={24} sm={24} md={16} lg={12}>

            <UserRegister callback={this.registerCallback}/>

          </Col>
          <Col xs={0} sm={0} md={4} lg={6} />
        </Row>

      </div>

    )

  }

}
