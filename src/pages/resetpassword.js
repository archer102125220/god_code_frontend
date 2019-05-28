/**
 * title: 重設密碼
 * authorized:
 *   name: isGuest
 *   failRedirect: /
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';

import { Button, Spin, Card } from 'antd';

import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

import ResetPasswordForm from '@/components/Form/ResetPassword';

import styles from './resetpassword.css';

@withRouter
@connect(state => ({
  loading: _.get(state, 'loading.effects.auth/PATCH_resetPassword', false),
}))
class ResetPassword extends React.Component{

  getResetToken = () => {
    const { location } = this.props;
    const token = _.get(location, 'query.token', null);
    if(_.isNull(token)){
      router.push('/');
      return null;
    }else{
      return token;
    }
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'resetPasswordForm.validateFields')) return null;
    this.resetPasswordForm.validateFields((err, values) => {
      if(err) return err;
      const token = this.getResetToken();
      this.props.dispatch({
        type: 'auth/PATCH_resetPassword',
        payload: {
          ...values,
          token,
        },
        callback: () => {
          router.push('/login');
        },
      });
    });
  }

  render() {
    const { loading } = this.props;
    const token = this.getResetToken();
    if(_.isNull(token)) return null;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Logo />
          <Spin tip="處理中" spinning={loading}>
            <Card title="重新設定您的密碼">
              <ResetPasswordForm isEdit={true} ref={(f) => { this.resetPasswordForm = f; }} />
              <Button type="primary" size="large" onClick={this.handleFormSubmit} style={{ float: 'right' }}>
                重設密碼
              </Button>
            </Card>
          </Spin>
          <div style={{ textAlign: 'center', paddingTop: 15 }}>
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

export default ResetPassword;
