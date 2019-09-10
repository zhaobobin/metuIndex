import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import styles from './AccountCenter.less';

import NotFound from "@/pages/Other/404";
import AccountCenterBanner from '@/containers/Account/AccountCenterBanner';
import AccountMenu from '@/containers/Account/AccountMenu'
import RouteExtend from '@/components/Common/RouteExtend'
const Routes = RouteExtend('users');

@connect(state => ({
  global: state.global,
  oss: state.oss,
}))
export default class AccountCenter extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      username: '',
      detail: '',
    };
  }

  componentDidMount(){
    const username = this.props.match.params.username;
    this.queryUserDetail(username);
  }

  queryUserDetail(username){
    this.props.dispatch({
      type: 'global/userinfo',
      payload: {
        username
      }
    });
  }

  render(){

    const { userInfo } = this.props.global;

    return(

      <div className={styles.container}>

        {
          !userInfo ?
            null
            :
            <div className={styles.content}>
              <AccountCenterBanner detail={userInfo} />

              <AccountMenu routes={Routes} username={userInfo.username} />

              <div className={styles.content}>
                <Switch>
                  {
                    Routes.children.map(item => (
                      <Route
                        exact={item.exact}
                        key={item.path}
                        path={`/${Routes.path}/${item.path}`}
                        component={item.component}
                      />
                    ))
                  }
                  <Redirect exact from={`/${Routes.key}/${userInfo.username}`} to={`/${Routes.key}/${userInfo.username}/photos`}/>
                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
        }

      </div>

    )
  }

}
