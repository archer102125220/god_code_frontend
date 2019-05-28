/**
 * title: 用戶清單
 * breadcrumb: 用戶
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: user.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';

import { Button, Card } from 'antd';

import Authorized from '@/components/Authorized';

import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';

@connect(state => ({
  authUser: _.get(state, 'auth.user', {}),
  users: _.get(state, 'users', []),
  loading: _.get(state, 'loading.effects.users/GET_users', true) || _.get(state, 'loading.effects.users/DELETE_user', false) || _.get(state, 'loading.effects.users/CHANGESTATUS_user', false),
}))
class UserIndex extends React.Component {
  tableColumns = [
    {
      title: '帳號',
      dataIndex: 'username',
      sorter: Table.Sorter.wrapValue(Table.Sorter.byText, 'username'),
      ...Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'username')),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: Table.Sorter.wrapValue(Table.Sorter.byText, 'name'),
      ...Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'name')),
    },
    {
      title: '電話',
      dataIndex: 'phone',
    },
    {
      title: '電子郵件',
      dataIndex: 'email',
    },
    Table.Render.generateEnabledStatusCol(),
    Table.Render.generateActionCol({
      showDetail: true,
      onDetail: (record) => router.push(`/user/${record.id}`),
      showEdit: Authorized.$hasPermission('user.edit'),
      onEdit: (record) => router.push(`/user/${record.id}/edit`),
      showDelete: Authorized.$hasPermission('user.delete'),
      onDelete: (record) => this.props.dispatch({
        type: 'users/DELETE_user',
        payload: record,
      }),
      showStatus: Authorized.$hasPermission('user.disable'),
      onStatus: (record, status) => this.props.dispatch({
        type: 'users/CHANGESTATUS_user',
        payload: {
          id: _.get(record, 'id'),
          status,
        },
      }),
      render: (text, record, defaultRender) => {
        const { authUser } = this.props;
        return defaultRender({
          showEdit: false,
          showDelete: false,
          showStatus: false,
        });
      }
    }),
  ];

  componentDidMount() {
    this.props.dispatch({
      type: 'users/GET_users',
    });
  }

  render() {
    const { users, loading } = this.props;
    const action = (
      <div>
        {Authorized.$hasPermission('user.create') && <Button type="primary" icon="plus" onClick={() => router.push('/user/create')}>新增</Button>}
      </div>
    );
    return (
      <div>
        <PageHeader action={action} />
        <Card style={{ margin: 20 }}>
          <Table columns={this.tableColumns} dataSource={users} loading={loading} />
        </Card>
      </div>
    );
  }
}

export default UserIndex;
