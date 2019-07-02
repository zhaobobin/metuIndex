/**
 * 文档 - 菜单
 */
import React from 'react';
import { NavLink, Route } from 'dva/router';
import styles from './DocSlideMenu.less'

export default function DocSlideMenu ({routes}) {
  return(
    <div className={styles.menu}>
      <ul>
        {
          routes.map(item => (
            item.isHide ?
              null
              :
              <li key={item.path} >
                <p>
                  <NavLink
                    activeClassName={styles.active}
                    to={item.path}
                  >
                    {item.name}
                  </NavLink>
                </p>
              </li>
          ))
        }
      </ul>
    </div>
  )
}
