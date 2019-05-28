import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import {
  Avatar,
  Dropdown,
  Menu,
  Icon,
  Spin
} from 'antd';

import ProfileModal from '@/components/Modals/Profile';

import styles from './UserMenu.css';

@connect(state => ({
  user: _.get(state, 'auth.user', null),
  loading: _.get(state, 'loading.models.auth', false) || _.get(state, 'loading.effects.auth/POST_login', false),
}))
class UserMenu extends React.Component {
  handleMenuClick = item => {
    const { key } = item;
    switch (key) {
      case 'profile':
        this.props.dispatch({
          type: 'modals/SHOW',
          key: ProfileModal.NAME,
        });
        break;
      case 'logout':
        this.props.dispatch({
          type: 'auth/SET_logout',
        });
        break;
      default:
        break;
    }
  };

  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="profile">
        <Icon type="setting" />個人資料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />登出
      </Menu.Item>
    </Menu>
  );

  renderMenu() {
    const { user, loading } = this.props;
    if (loading) {
      return <Spin size="small" style={{ marginLeft: 8 }} spinning={loading} />;
    } else if (!_.isNull(user)) {
      return (
        <Dropdown overlay={this.menu} trigger={['click']}>
          <a className={["ant-dropdown-link", styles.user]}>
            <span style={{
              paddingRight: 5,
              display: 'inline-block'
            }}>
              <Avatar size="large" icon="user" />
            </span>
            <span style={{
              display: 'inline-block'
            }}>
              {user.username} <Icon type="down" />
            </span>
          </a>
        </Dropdown>
      );
    }
    return null;
  }

  render(){
    return (
      <React.Fragment>
        {this.renderMenu()}
        <ProfileModal />
      </React.Fragment>
    )
  }
}

export default UserMenu;
