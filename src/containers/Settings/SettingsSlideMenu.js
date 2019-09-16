/**
 * 设置 - 菜单
 */
import React from 'react';
import { NavLink } from 'dva/router';
import { Icon } from 'antd'
import { FormattedMessage } from 'react-intl';
import styles from './SettingsSlideMenu.less';

export default function SettingsSlideMenu ({ routes }) {

  return(
    <div className={styles.menu}>

      <ul>
        {
          routes.children.map(item => (
            <li key={item.path} >
              <NavLink
                activeClassName={styles.active}
                to={`/${routes.path}/${item.path}`}
              >
                <FormattedMessage id={item.id}/>
                <Icon type="right" />
              </NavLink>
            </li>
          ))
        }
      </ul>

    </div>
  )

};
