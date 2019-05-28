/**
 * title: 建立角色
 * breadcrumb: 建立
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: role.create
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import RoleForm from '@/components/Form/Role';
import PermissionForm from '@/components/Form/Permission';

const TAB_ROLE = 'TAB_ROLE';
const TAB_PERMISSION = 'TAB_PERMISSION';

@connect(state => ({
  loading: _.get(state, 'loading.effects.roles/POST_role', false)
}))
class RoleCreate extends React.Component {
  state = {
    tabActiveKey: TAB_ROLE,
    showPermissionTab: true,
    isFormChange: false,
  }

  handleFormSubmit = () => {
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
        type: 'roles/POST_role',
        payload: submitPayload,
        callback: () => router.push('/role'),
      });
    });
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
        showPermissionTab: !allpermission,

      });
    }
    this.setState({
      isFormChange: true
    })
  }

  getTabList = () => {
    const { tabActiveKey, showPermissionTab } = this.state;
    if (tabActiveKey === TAB_PERMISSION && !showPermissionTab) {
      this.setState({
        tabActiveKey: TAB_ROLE,
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
        <Button icon="close" onClick={() => router.push('/role')}>取消</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} tabList={this.getTabList()} tabActiveKey={tabActiveKey} onTabChange={this.handleTabChange} />
        <div style={{ display: (tabActiveKey === TAB_ROLE) ? 'block' : 'none' }}>
          <Spin tip="儲存中" spinning={loading}>
            <Card style={{ margin: 20 }}>
              <RoleForm ref={(f) => { this.roleForm = f; }} isCreate={true} onValuesChange={this.handleRoleFormValuesChange} />
            </Card>
          </Spin>
        </div>
        <div style={{ display: (tabActiveKey === TAB_PERMISSION) ? 'block' : 'none' }}>
          <Spin tip="儲存中" spinning={loading}>
            <Card style={{ margin: 20 }}>
              <PermissionForm ref={(f) => { this.permissionForm = f; }} isCreate={true} onValuesChange={this.handleFormChange} />
            </Card>
          </Spin>
        </div>
        <PageFooter action={action} />
      </div>
    );
  }
}

export default RoleCreate;
