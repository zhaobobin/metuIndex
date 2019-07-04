/**
 * 文档 - 菜单
 */
import React from 'react';
import { NavLink } from 'dva/router';
import { Menu } from 'antd'
import styles from './DocSlideMenu.less'

const { SubMenu } = Menu;

export default function DocSlideMenu ({navData}) {
  // console.log(navData)

  return(
    <div className={styles.menu}>

      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['components', 'model']}
        mode="inline"
      >
        {
          navData.map((item, index) => (
            !item.children ?

              <Menu.Item key={item.key} className={styles.item}>
                <NavLink
                  exact
                  to={`/${item.path}`}
                  activeClassName={styles.active}
                >
                  {item.name}
                </NavLink>
              </Menu.Item>
              :
              <SubMenu
                key={item.key}
                title={<h4>{item.name}</h4>}
                className={styles.subItem}
              >
                {
                  item.children.map((t, j) => (
                    <Menu.Item key={j}>
                      <NavLink
                        exact
                        to={`/${item.path}/${t.path}`}
                        activeClassName={styles.active}
                      >
                        {t.name}
                      </NavLink>
                    </Menu.Item>
                  ))
                }
              </SubMenu>
          ))
        }
      </Menu>

      {/*<ul>*/}
        {/*{*/}
          {/*routes.map(item => (*/}
            {/*item.isHide ?*/}
              {/*null*/}
              {/*:*/}
              {/*<li key={item.path} >*/}
                {/*<p>*/}
                  {/*<NavLink*/}
                    {/*activeClassName={styles.active}*/}
                    {/*to={item.path}*/}
                  {/*>*/}
                    {/*{item.name}*/}
                  {/*</NavLink>*/}
                {/*</p>*/}
              {/*</li>*/}
          {/*))*/}
        {/*}*/}
      {/*</ul>*/}
    </div>
  )
}
