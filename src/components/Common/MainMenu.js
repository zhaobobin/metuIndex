import React from 'react';
import { Link } from 'dva/router';
//import { NavLink } from 'react-router-dom'
import { Menu } from 'antd';
import { ENV, Storage } from '~/utils/utils';
import styles from './MainMenu.less';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export default class MainMenu extends React.Component {

  state = {
    current: Storage.get(ENV.storageCurrentMenu) ? Storage.get(ENV.storageCurrentMenu) : 'home'
  };

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.state.pathname){
      //console.log(nextProps.location.pathname)
      let path = nextProps.location.pathname.split('/')[1];
      if(path === 'u' || path === 'setting' || path === 'publish'){
        this.setState({ current: '' });
      }
    }
  }

  handleClick = (e) => {
    Storage.set(ENV.storageCurrentMenu, e.key);
    this.setState({ current: e.key });
  };

  getMenuList(menusData){
    if (!menusData) return [];
    return menusData.map((item, index) => {
      if (!item.name || item.isHide) return null;
      return(
        item.children ?
          <SubMenu key={item.key} title={<span>{item.name}</span>}>
            {
              item.children.map((topic, i) => (
                topic.isHide ? null :
                <MenuItem key={topic.key}>
                  <Link to={`/${item.path}/${topic.path}`}>{topic.name}</Link>
                </MenuItem>
              ))
            }
          </SubMenu>
          :
          <MenuItem key={item.key}>
            <Link to={`/${item.path}`}>{item.name}</Link>
          </MenuItem>
      )
    })
  }

  render(){

    const { navData } = this.props;

    return(
      <div className={styles.mainMenu}>
        <Menu
          theme="dark"
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          {this.getMenuList(navData)}
        </Menu>
      </div>
    )
  }

}
