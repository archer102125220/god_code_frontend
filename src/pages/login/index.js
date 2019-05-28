/**
 * title: 登入
 * authorized:
 *   name: isGuest
 *   failRedirect: /
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import { Tabs, Button, Spin, Card } from 'antd';

import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

import LoginForm from '@/components/Form/Login';
import ForgetPasswordForm from '@/components/Form/ForgetPassword';

import styles from './index.css';

const TAB_LOGIN = 'TAB_LOGIN';
const TAB_FORGET = 'TAB_FORGET';

@connect(state => ({
  loading: _.get(state, 'loading.effects.auth/POST_login', false) || _.get(state, 'loading.effects.auth/POST_resetPassword', false),
}))
class Login extends React.Component {
  state = {
    currentTab: TAB_LOGIN,
    loadingTip: '',
  }

  handleTabChange = (key) => {
    this.setState({
      currentTab: key,
    });
  }

  handleFormSubmit = () => {
    const { currentTab } = this.state;
    const form = (currentTab === TAB_FORGET) ? this.forgetPasswordForm : this.loginForm;
    form.validateFields((err, values) => {
      if (err) return err;
      if (currentTab === TAB_LOGIN) {
        this.setState({
          loadingTip: '登入中'
        });
        this.props.dispatch({
          type: 'auth/POST_login',
          payload: values,
          callback: (err) => {
            if (err) form.resetFields()
          }
        });
      }
      if (currentTab === TAB_FORGET) {
        this.setState({
          loadingTip: '處理中'
        });
        this.props.dispatch({
          type: 'auth/POST_resetPassword',
          payload: values,
          callback: () => {
            form.resetFields()
          }
        });
      }
    });
  }

  render() {
    const { currentTab, loadingTip } = this.state;
    const { loading } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Logo />
          <Spin tip={loadingTip} spinning={loading}>
            <Card>
              <Tabs tabBarStyle={{ textAlign: 'center' }} defaultActiveKey={currentTab} activeKey={currentTab} onChange={this.handleTabChange}>
                <Tabs.TabPane tab="登入" key={TAB_LOGIN}>
                  <div className={styles.tab_content}>
                    <LoginForm ref={(f) => { this.loginForm = f; }} onSubmit={this.handleFormSubmit} />
                    <div className={styles.tab_action}>
                      <Button type="primary" size="large" onClick={this.handleFormSubmit} style={{ float: 'right' }}>
                        開始使用
                      </Button>
                      <a onClick={() => { this.handleTabChange(TAB_FORGET) }}>忘記密碼了嗎?</a>
                    </div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="忘記密碼" key={TAB_FORGET}>
                  <div className={styles.tab_content}>
                    <ForgetPasswordForm ref={(f) => { this.forgetPasswordForm = f; }} onSubmit={this.handleFormSubmit} />
                    <div className={styles.tab_action}>
                      <Button type="danger" size="large" onClick={this.handleFormSubmit} style={{ float: 'right' }}>
                        重設密碼
                      </Button>
                    </div>
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Spin>
          <div style={{ textAlign: 'center', paddingTop: 15 }}>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}


export default Login;
