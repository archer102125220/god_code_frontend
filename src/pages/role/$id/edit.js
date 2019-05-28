/**
 * title: 編輯角色
 * breadcrumb: 編輯
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: role.edit
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
import RoleForm from '@/components/Form/Role';
import PermissionForm from '@/components/Form/Permission';

const TAB_ROLE = 'TAB_ROLE';
const TAB_PERMISSION = 'TAB_PERMISSION';

@withRouter
@connect(state => ({
  roles: _.get(state, 'roles', []),
  loading: _.get(state, 'loading.effects.roles/GET_roles', false) || _.get(state, 'loading.effects.roles/PATCH_role', false),
}))
class RoleEdit extends React.Component {
  state = {
    tabActiveKey: TAB_ROLE,
    showPermissionTab: null,
    isFormChange: false,
  }

  getRole = () => {
    const { roles, match } = this.props;
    const id = _.toInteger(_.get(match, 'params.id', -1));
    const role = _.find(roles, ['id', id]);
    return (_.isUndefined(role)) ? null : role;
  }

  handleFormSubmit = () => {
    const role = this.getRole();
    if (_.isNull(role)) return null;
    if (!_.has(this, 'roleForm.validateFields')) return null;
    let submitPayload = {};
    this.roleForm.validateFields((roleErr, roleValues) => {
      // 開始處理傳送資料
      if (roleErr) {
        this.setState({
          tabActiveKey: TAB_ROLE,
        });
        return roleErr;
      }
      submitPayload = _.extend(submitPayload, _.pick(roleValues, ['name', 'allpermission', 'description']));
      // 建立權限表
      if (_.has(this, 'permissionForm.validateFields') && !_.get(roleValues, 'allpermission', false)) {
        this.permissionForm.validateFields((permissionErr, permissionValues) => {
          if (permissionErr) {
            this.setState({
              tabActiveKey: TAB_PERMISSION,
            });
            return permissionErr
          };
          const permissions = _.flatMap(permissionValues, (permissions, model) => {
            return _.reduce(permissions, (res, v, k) => {
              if (v) res.push(`${model}.${k}`);
              return res;
            }, [])
          })
          _.set(submitPayload, 'permissions', permissions);
        });
      }
      // 傳送資料
      this.props.dispatch({
        type: 'roles/PATCH_role',
        payload: {
          id: _.get(role, 'id'),
          data: submitPayload,
        },
        callback: () => router.push('/role'),
      });
    });
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

  handleRoleFormValuesChange = (changedValues, allValues) => {
    const { allpermission } = changedValues;
    if (!_.isUndefined(allpermission) && _.isBoolean(allpermission)) {
      this.setState({
        showPermissionTab: !allpermission
      });
    }
    this.setState({
      isFormChange: true
    })
  }

  getTabList = () => {
    const role = this.getRole();
    const { tabActiveKey, showPermissionTab } = this.state;
    const roleAllAccess = (!_.isNull(role)) ? !((_.get(role, 'special', '') === 'all-access') ? true : false) : false;
    if (_.isNull(showPermissionTab)) {
      this.setState({
        showPermissionTab: roleAllAccess,
      });
    }
    const showTab = (_.isNull(showPermissionTab)) ? roleAllAccess : showPermissionTab;
    if (tabActiveKey === TAB_PERMISSION && !showPermissionTab) {
      this.setState({
        tabActiveKey: TAB_ROLE,
        showPermissionTab: showTab,
      });
    }
    const res = [{
      key: TAB_ROLE,
      tab: '角色',
    }];
    if (showTab) {
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

  handleFormChange = (isChange) => {
    if (isChange) {
      this.setState({
        isFormChange: true
      })
    }
  }

  render() {
    const { loading } = this.props;
    const { tabActiveKey, isFormChange } = this.state;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/role')}>返回</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} tabList={this.getTabList()} tabActiveKey={tabActiveKey} onTabChange={this.handleTabChange} />
        <div style={{ display: (tabActiveKey === TAB_ROLE) ? 'block' : 'none' }}>
          <Spin tip="載入中" spinning={loading}>
            <Card style={{ margin: 20 }}>
              <RoleForm ref={(f) => { this.roleForm = f; }} isEdit={true} defaultValue={this.getRoleFormValue()} onValuesChange={this.handleRoleFormValuesChange} />
            </Card>
          </Spin>
        </div>
        <div style={{ display: (tabActiveKey === TAB_PERMISSION) ? 'block' : 'none' }}>
          <Spin tip="載入中" spinning={loading}>
            <Card style={{ margin: 20 }}>
              <PermissionForm ref={(f) => { this.permissionForm = f; }} isEdit={true} defaultValue={this.getPermissionFormValue()} onValuesChange={this.handleFormChange} />
            </Card>
          </Spin>
        </div>
        <PageFooter action={action} />
      </div>
    )
  }
}

export default RoleEdit;
