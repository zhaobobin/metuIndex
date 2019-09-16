import React from 'react';
import { connect } from 'dva';
import { Route, Switch } from 'dva/router';
import { Layout, BackTop } from 'antd';
import ENV from '@/config/env'
import Storage from '@/utils/storage';
import { injectIntl } from 'react-intl';
import DocumentTitle from 'react-document-title';
import NotFound from "@/pages/Other/404";

// import Loading from '@/components/Common/Loading';
import LoadingBg from '@/components/Common/LoadingBg';
import GlobalHeader from '@/components/Common/GlobalHeader';
import GlobalFooter from '@/components/Common/GlobalFooter';
import GlobalContent from '@/components/Common/GlobalContent';

@connect(state => ({
  global: state.global
}))
class BaseLayout extends React.Component {

  componentDidMount(){
    Storage.remove(ENV.storage.history)
    this.token();
  }

  componentWillUnmount(){

  }

  token() {
    this.props.dispatch({
      type: 'global/token',
      payload: {}
    });
  }

  //监控路由变化
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      //返回页面顶部
      // window.scrollTo(0, 0);
      //添加路由历史
      let routerHistory = Storage.get(ENV.storage.routerHistory, 3600*24) || [];
      routerHistory.push(nextProps.location.pathname);
      Storage.set(ENV.storage.routerHistory, routerHistory);
    }
  }

  //获取页面标题
  getPageTitle() {
    const { intl, location, getRouteData } = this.props;
    const { pathname } = location;
    const routeData = getRouteData('BaseLayout');

    let title = '';
    if(pathname === '/'){
      title = intl.formatMessage({id: 'env.hometitle'});
    }else{
      let appname = intl.formatMessage({id: 'env.appname'});
      title = this.foreachTitle(routeData, pathname).slice(3) + ' - ' + appname;
    }
    return title;
  }

  //循环标题
  foreachTitle(routeData, pathname){
    let title = '', { intl } = this.props;
    for(let i in routeData){
      if (pathname.indexOf(routeData[i].key) > -1) {
        let routeName = intl.formatMessage({id: routeData[i].id});   //路径名称
        title = this.foreachTitle(routeData[i].children, pathname) + ' - ' + routeName;
      }
    }
    return title;
  }

  render(){

    const { getRouteData, navData, location } = this.props;
    const path = location.pathname.split('/')[1];
    const { loading } = this.props.global;

    const layout = loading ?
      <LoadingBg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
      :
      <Layout style={{minHeight: '100vh'}}>

        <GlobalHeader navData={navData[0].children} location={location}/>

        <GlobalContent>

          <Switch>
            {
              getRouteData('BaseLayout').map(item =>
                (
                  <Route
                    exact={item.exact}
                    key={item.path}
                    path={item.path}
                    component={item.component}
                  />
                )
              )
            }
            <Route component={NotFound} />
          </Switch>

          <BackTop />
        </GlobalContent>

        {
          path === 'publish' ? null : <GlobalFooter/>
        }

      </Layout>

    return(
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    )
  }

}

export default injectIntl(BaseLayout, {withRef: true});
