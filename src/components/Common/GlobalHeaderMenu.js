import React from 'react';
import { NavLink } from 'dva/router';
import { FormattedMessage } from 'react-intl';
import styles from './GlobalHeaderMenu.less';

function getMenuList(navData){

  if (!navData) return [];
  return navData.map((item, index) => {
    if (!item.name || item.isHide) return null;
    return(
      <li key={item.key}>
        <NavLink
          exact={item.exact}
          className={styles.link}
          activeClassName={styles.current}
          to={`/${item.path}`}
        >
          <FormattedMessage id={item.id}/>
        </NavLink>

        {
          item.children ?
            <div className={styles.submenu}>
              {
                item.children.map((topic, i) => (
                  topic.isHide ?
                    null
                    :
                    <p key={i}>
                      <NavLink
                        className={styles.sublink}
                        activeClassName={styles.active}
                        to={`/${item.path}/${topic.path}`}
                      >
                        <FormattedMessage id={topic.id}/>
                      </NavLink>
                    </p>
                ))
              }
            </div>
            :
            null
        }
      </li>
    )
  })
}

export default function GlobalHeaderMenu ({navData}) {

  return(
    <ul className={styles.menu}>
      {getMenuList(navData)}
    </ul>
  )

}
