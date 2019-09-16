/**
 * 账户 - 导航菜单
 */
import React from 'react';
import { NavLink } from 'dva/router';
import { FormattedMessage } from 'react-intl';
import styles from './AccountMenu.less';

export default function AccountMenu({ routes, username }) {

  return(
    <ul className={styles.container}>
      {
        routes.children.map((item, index) => (
          <li key={index} className={styles.item}>
            {
              item.isHide ?
                null
                :
                <NavLink
                  activeClassName={styles.active}
                  to={`/${routes.key}/${username}/${item.path}`}
                >
                  <FormattedMessage id={item.id}/>
                </NavLink>
            }
          </li>
        ))
      }
    </ul>
  )

}
