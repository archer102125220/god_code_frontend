/**
 * title: 建立用戶
 * breadcrumb: 建立
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: user.create
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';

import UserForm from '@/components/Form/User';

@connect(state => ({
  loading: _.get(state, 'loading.effects.users/POST_user', false),
}))
class UserCreate extends React.Component {
  state = {
    isFormChange: false,
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'userForm.validateFields')) return null;
    this.userForm.validateFields((err, values) => {
      if (err) return err;
      this.props.dispatch({
        type: 'users/POST_user',
        payload: values,
        callback: () => router.push('/user'),
      });
    });
  }

  handleFormChange = (isChange) => {
    if (isChange) {
      this.setState({
        isFormChange: true
      })
    }
  }

  render() {
    const { loading } = this.props;
    const { isFormChange } = this.state;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/user')}>取消</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} />
        <Spin tip="儲存中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <UserForm ref={(f) => { this.userForm = f; }} isCreate={true} onValuesChange={this.handleFormChange} />
          </Card>
        </Spin>
        <PageFooter action={action} />
      </div>
    );
  }
}

export default UserCreate;
