import React from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import NotFound from "@/pages/Other/404";
import styles from './AccountContent.less'

export default function AccountContent({ routes, username }) {

  return(
    <div className={styles.container}>
      <Switch>
        {
          routes.children.map(item => (
            <Route
              exact={item.exact}
              key={item.path}
              path={`/${routes.path}/${item.path}`}
              component={item.component}
            />
          ))
        }
        <Redirect exact from={`/${routes.key}/${username}`} to={`/${routes.key}/${username}/photos`}/>
        <Route component={NotFound} />
      </Switch>
    </div>
  )

}
