/**
 * title: 詳細資料
 * breadcrumb: 詳細
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: role.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';

import { Button, Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';
import RoleForm from '@/components/Form/Role';
import PermissionForm from '@/components/Form/Permission';

const TAB_ROLE = 'TAB_ROLE';
const TAB_PERMISSION = 'TAB_PERMISSION';

@withRouter
@connect(state => ({
  roles: _.get(state, 'roles', []),
  loading: _.get(state, 'loading.effects.roles/GET_roles', false),
}))
class RoleDetail extends React.Component {
  state = {
    tabActiveKey: TAB_ROLE,
    showPermissionTab: false,
  }

  getRole = () => {
    const { roles, match } = this.props;
    const id = _.toInteger(_.get(match, 'params.id', -1));
    const role = _.find(roles, ['id', id]);
    return (_.isUndefined(role)) ? null : role;
  }

  componentDidMount() {
    const role = this.getRole();
    if (_.isNull(role)) {
      this.props.dispatch({
        type: 'roles/GET_roles',
      });
    }
  }

  handleTabChange = (key) => {
    this.setState({
      tabActiveKey: key,
    });
  }

  getTabList = () => {
    const role = this.getRole();
    const { tabActiveKey } = this.state;
    const showPermissionTab = (!_.isNull(role)) ? !((_.get(role, 'special', '') === 'all-access') ? true : false) : false;
    if (tabActiveKey === TAB_PERMISSION && !showPermissionTab) {
      this.setState({
        tabActiveKey: TAB_ROLE,
        showPermissionTab,
      });
    }
    const res = [{
      key: TAB_ROLE,
      tab: '角色',
    }];
    if (showPermissionTab) {
      res.push({
        key: TAB_PERMISSION,
        tab: '權限',
      });
    }
    return res;
  }

  getRoleFormValue = () => {
    const role = this.getRole();
    if (_.isNull(role)) return {};
    const res = _.pick(role, ['name', 'description']);
    const allpermission = (_.get(role, 'special', '') === 'all-access') ? true : false;
    _.set(res, 'allpermission', allpermission);
    return res;
  }

  getPermissionFormValue = () => {
    const role = this.getRole();
    if (_.isNull(role)) return {};
    const { permissions } = role;
    if (_.isArray(permissions)) {
      return _.reduce(permissions, (res, p) => {
        _.set(res, p, true);
        return res;
      }, {});
    }
    return {};
  }

  render() {
    const { loading } = this.props;
    const { tabActiveKey } = this.state;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/role')}>返回</Button>
      </div>
    );
    return (
      <div>
        <PageHeader action={action} tabList={this.getTabList()} tabActiveKey={tabActiveKey} onTabChange={this.handleTabChange} />
        <div style={{ display: (tabActiveKey === TAB_ROLE) ? 'block' : 'none' }}>
          <Spin tip="載入中" spinning={loading}>
            <Card style={{ margin: 20 }}>
              <RoleForm isReadonly={true} defaultValue={this.getRoleFormValue()} />
            </Card>
          </Spin>
        </div>
        <div style={{ display: (tabActiveKey === TAB_PERMISSION) ? 'block' : 'none' }}>
          <Spin tip="載入中" spinning={loading}>
            <Card style={{ margin: 20 }}>
              <PermissionForm isReadonly={true} defaultValue={this.getPermissionFormValue()} />
            </Card>
          </Spin>
        </div>
      </div>
    )
  }
}

export default RoleDetail;
