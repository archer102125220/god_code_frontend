import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'umi/withRouter';

import NavLink from 'umi/navlink';

import { Menu, Icon } from 'antd';

import Authorized from '@/components/Authorized';

import { matchRoute } from '@/utils/router';

import menuConfig from '@/config/sideMenu';

import styles from './SideMenu.css';

const renderMenuItemIfNotFound = false; // 當連結失效時，是否要繼續顯示選單

@withRouter
class SideMenu extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  renderMenuItem(menu) {
    const { link, icon } = menu;
    const route = matchRoute(link);
    const title = _.get(menu, 'title') || _.get(route, 'breadcrumb') || _.get(route, 'title');
    const itemComponent = (
      <Menu.Item key={link} className={(link==='/file'||link==='/')?styles.itemTitle:styles.item}>
        {
          (_.get(route, 'path') === link) ?
            (
              <NavLink to={link}>
                <Icon type={icon} />
                <span>{title}</span>
              </NavLink>
            ) :
            (
              <React.Fragment>
                <Icon type={icon} />
                <span>{title}</span>
              </React.Fragment>
            )
        }
      </Menu.Item>
    );
    if (_.get(route, 'path') !== link && !renderMenuItemIfNotFound) return null;
    const authorizedRoute = _.get(route, 'authorized', {});
    const { name, params } = authorizedRoute;
    if (_.isUndefined(name)) return itemComponent;
    return (_.invoke(Authorized, `\$${name}`, params)) ? itemComponent : null;
  }

  renderMenuGroup(menuGroup, index) {
    const { icon, title, menu } = menuGroup;
    
    if (_.isUndefined(menu)) return this.renderMenuItem(menuGroup);
    const titleComponent = (
      <span className={styles.itemTitle}>
        <Icon type={icon} />
        <span>{title}</span>
      </span>
    );
    const menuComponents = _.map(menu, this.renderMenuItem.bind(this));
    _.remove(menuComponents, _.isNull);
    return (menuComponents.length === 0) ? null : (
      <Menu.SubMenu key={`sidemenu-group-${index}`} title={titleComponent}>
        {
          _.map(menu, this.renderMenuItem.bind(this))
        }
      </Menu.SubMenu>
    );
  }

  render() {
    const { location } = this.props;
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']} selectedKeys={[location.pathname]}>
        {
          _.map(menuConfig, this.renderMenuGroup.bind(this))
        }
      </Menu>
    );
  }
}

export default SideMenu;
