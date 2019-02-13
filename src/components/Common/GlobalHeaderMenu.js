import React from 'react';
import { Link, NavLink } from 'dva/router';
import styles from './GlobalHeaderMenu.less';

function getMenuList(menusData){
  if (!menusData) return [];
  return menusData.map((item, index) => {
    if (!item.name || item.isHide) return null;
    return(
      <li key={item.key}>
        <NavLink
          exact={item.exact}
          className={styles.link}
          activeClassName={styles.current}
          to={`/${item.path}`}
        >
            <span>
              {item.name}
            </span>
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
                        {topic.name}
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
