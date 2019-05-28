import React from 'react';

import { Layout, Icon } from 'antd';

import Logo from '@/components/Logo';
import SideMenu from '@/components/SideMenu';
import Footer from '@/components/Footer';

import UserMenu from '@/components/UserMenu';

import styles from './AdminLayout.css';

class AdminLayout extends React.Component {

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Layout.Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width={250}
        >
          <Logo />
          <SideMenu />
        </Layout.Sider>
        <Layout>
          <Layout.Header className={styles.header}>
            <div className={styles.header_container}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              <div style={{ float: 'right', height: '100%' }}>
                <UserMenu />
              </div>
            </div>
          </Layout.Header>
          <Layout.Content>
            {this.props.children}
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    );
  }
}

export default AdminLayout;
