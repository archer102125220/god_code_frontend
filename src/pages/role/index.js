/**
 * title: 角色清單
 * breadcrumb: 角色權限
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: role.index
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
  authRoles: _.get(state, 'auth.roles', []),
  roles: _.get(state, 'roles', []),
  loading: _.get(state, 'loading.effects.roles/GET_roles', true) || _.get(state, 'loading.effects.roles/DELETE_role', false),
}))
class RoleIndex extends React.Component {
  tableColumns = [
    {
      title: '角色名稱',
      dataIndex: 'name',
      sorter: Table.Sorter.wrapValue(Table.Sorter.byText, 'name'),
      ...Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'name')),
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    Table.Render.generateActionCol({
      showDetail: true,
      onDetail: (record) => router.push(`/role/${record.id}`),
      showEdit: Authorized.$hasPermission('role.edit'),
      onEdit: (record) => router.push(`/role/${record.id}/edit`),
      showDelete: Authorized.$hasPermission('role.delete'),
      onDelete: (record) => this.props.dispatch({
        type: 'roles/DELETE_role',
        payload: record,
      }),
      render: (text, record, defaultRender) => {
        const { authRoles } = this.props;
        const roleIds = _.map(authRoles, r => _.get(r, 'id'));
        if (_.indexOf(roleIds, _.get(record, 'id')) >= 0) {
          return defaultRender({
            showEdit: false,
            showDelete: false,
          });
        } else {
          return defaultRender();
        }
      }
    }),
  ];

  componentDidMount() {
    this.props.dispatch({
      type: 'roles/GET_roles',
    });
  }

  render() {
    const { roles, loading } = this.props;
    const action = (
      <div>
        {Authorized.$hasPermission('role.create') && <Button type="primary" icon="plus" onClick={() => router.push('/role/create')}>新增</Button>}
      </div>
    );
    return (
      <div>
        <PageHeader action={action} />
        <Card style={{ margin: 20 }}>
          <Table columns={this.tableColumns} dataSource={roles} loading={loading} />
        </Card>
      </div>
    );
  }
}

export default RoleIndex;
