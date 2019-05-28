/**
 * title: 編輯用戶
 * breadcrumb: 編輯
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: user.edit
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';

import UserForm from '@/components/Form/User';

@withRouter
@connect(state => ({
  users: _.get(state, 'users', []),
  loading: _.get(state, 'loading.effects.users/PATCH_user', false),
}))
class UserEdit extends React.Component {
  state = {
    isFormChange: false,
  }

  getUser = () => {
    const { users, match } = this.props;
    const id = _.toInteger(_.get(match, 'params.id', -1));
    const user = _.find(users, ['id', id]);
    return (_.isUndefined(user)) ? null : _.extend(user, {
      role_id: _.get(user, 'roles.0.id', null),
    });
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'userForm.validateFields')) return null;
    const user = this.getUser();
    if (_.isNull(user)) return null;
    this.userForm.validateFields((err, values) => {
      if (err) return err;
      const data = _.isEmpty(_.get(values, 'password')) ? _.omit(values, ['password', 'password_confirmation']) : values;
      this.props.dispatch({
        type: 'users/PATCH_user',
        payload: {
          id: _.get(user, 'id'),
          data,
        },
        callback: () => router.push('/user'),
      });
    });
  }

  componentDidMount() {
    const user = this.getUser();
    if (_.isNull(user)) {
      this.props.dispatch({
        type: 'users/GET_users',
      });
    }
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
    const user = this.getUser();
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/user')}>返回</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} />
        <Spin tip="儲存中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <UserForm ref={(f) => { this.userForm = f; }} isEdit={true} defaultValue={user} onValuesChange={this.handleFormChange} />
          </Card>
        </Spin>
        <PageFooter action={action} />
      </div>
    );
  }
}

export default UserEdit;
