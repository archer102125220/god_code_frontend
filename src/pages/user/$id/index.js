/**
 * title: 詳細資料
 * breadcrumb: 詳細
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: user.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';

import { Button, Card } from 'antd';

import PageHeader from '@/components/PageHeader';

import UserForm from '@/components/Form/User';

@withRouter
@connect(({ users }) => ({ users }))
class UserDetail extends React.Component {
  getUser = () => {
    const { users, match } = this.props;
    const id = _.toInteger(_.get(match, 'params.id', -1));
    const user = _.find(users, ['id', id]);
    return (_.isUndefined(user)) ? null : _.extend(user, {
      role_id: _.get(user, 'roles.0.id', null),
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

  render() {
    const user = this.getUser();
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/user')}>返回</Button>
      </div>
    );
    return (
      <div>
        <PageHeader action={action} />
        <Card style={{ margin: 20 }}>
          <UserForm isReadonly={true} defaultValue={user} />
        </Card>
      </div>
    );
  }
}

export default UserDetail;
