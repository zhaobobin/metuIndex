import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col } from 'antd';
//import styles from './index.less';

import UserLogin from '~/blocks/User/UserLogin';

@connect(state => ({
  global: state.global,
}))
export default class Login extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  componentsDidMount(){

  }

  // 登录回调
  loginCallback = () => {
    this.props.dispatch(routerRedux.push('/'));
  };

  render(){

    return(

      <div>

        <Row>
          <Col xs={0} sm={0} md={4} lg={6} />
          <Col xs={24} sm={24} md={16} lg={12}>

            <UserLogin callback={this.loginCallback}/>

          </Col>
          <Col xs={0} sm={0} md={4} lg={6} />
        </Row>

      </div>

    )

  }

}
