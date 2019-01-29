import React from 'react';
import { connect } from 'dva';
import { Route, Switch } from 'dva/router';
import { Layout, BackTop } from 'antd';
import { ENV, Storage } from '~/utils/utils';
import DocumentTitle from 'react-document-title';
import NotFound from "~/routes/Other/404";

import Loading from '~/components/Common/Loading';
import GlobalHeader from '~/components/Common/GlobalHeader';
import GlobalFooter from '~/components/Common/GlobalFooter';
import GlobalContent from '~/components/Common/GlobalContent';

@connect(state => ({
  global: state.global
}))
export default class BaseLayout extends React.Component {

  componentDidMount(){
    this.props.dispatch({
      type: 'global/init',
      payload: {}
    });
  }

  //监控路由变化
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      //返回页面顶部
      window.scrollTo(0, 0);
      //添加路由历史
      let routerHistory = Storage.get(ENV.storageHistory) || [];
      routerHistory.push(nextProps.location.pathname);
      Storage.set(ENV.storageHistory, routerHistory);
    }
  }

  //获取页面标题
  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    const routeData = getRouteData('BaseLayout');

    let title = '';
    if(pathname === '/'){
      title = ENV.hometitle;
    }else{
      title = this.foreachTitle(routeData, pathname).slice(3) + ' - ' + ENV.appname;
    }
    return title;
  }

  //循环标题
  foreachTitle(routeData, pathname){
    let title = '';
    for(let i in routeData){
      if (pathname.indexOf(routeData[i].key) > -1) {
        title = this.foreachTitle(routeData[i].children, pathname) + ' - ' + routeData[i].name;
      }
    }
    return title;
  }

  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  };

  render(){

    const { getRouteData, navData, location } = this.props;
    const path = location.pathname.split('/')[1];
    const { loading } = this.props.global;

    const layout = (
      <Layout>
        <GlobalHeader navData={navData[0].children} location={location}/>

          <GlobalContent>
            {
              loading ?
                <Loading/>
                :
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
            }

            <BackTop />
          </GlobalContent>

        {
          path === 'publish' ? null : <GlobalFooter/>
        }

      </Layout>
    );

    return(
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    )
  }

}
