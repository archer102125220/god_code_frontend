/**
 * title: 系統配置
 * breadcrumb: 系統配置
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: config.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import Authorized from '@/components/Authorized';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import ConfigCompanyForm from '@/components/Form/ConfigCompany';
import ConfigMailForm from '@/components/Form/ConfigMail';

const TAB_COMPANY = 'TAB_COMPANY';
const TAB_MAIL = 'TAB_MAIL';

@connect(state => ({
  config: _.get(state, 'config', {}),
  loading: _.get(state, 'loading.effects.config/PATCH_configs', false),
}))
class ConfigEdit extends React.Component {
  state = {
    tabActiveKey: TAB_COMPANY,
    isFormChange: false,
  }

  handleTabChange = (key) => {
    this.setState({
      tabActiveKey: key,
    });
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'configCompanyForm.validateFields') || !_.has(this, 'configMailForm.validateFields')) return null;
    this.configCompanyForm.validateFields((configCompanyErr, configCompanyPayload) => {
      if (configCompanyErr) {
        this.setState({
          tabActiveKey: TAB_COMPANY,
        });
        return configCompanyErr
      };
      this.configMailForm.validateFields((configMailErr, configMailPayload) => {
        if (configMailErr) {
          this.setState({
            tabActiveKey: TAB_MAIL,
          });
          return configMailErr
        };
        const configCompanyValues = _.map(_.get(configCompanyPayload, 'company', {}), (v, k) => {
          return {
            key: `company.${k}`,
            value: v,
          };
        });
        const configMailValues = _.map(_.get(configMailPayload, 'mail', {}), (v, k) => {
          return {
            key: `mail.${k}`,
            value: v,
          };
        });
        const value = _.concat(configCompanyValues, configMailValues);
        this.props.dispatch({
          type: 'config/PATCH_configs',
          payload: {
            configs: value,
          },
          callback: () => router.push('/system/config'),
        });
      });
    });
  }

  componentDidMount() {
    const { config } = this.props;
    if (_.keys(config).length === 0) {
      this.props.dispatch({
        type: 'config/GET_configs',
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
    const { loading, config } = this.props;
    const { tabActiveKey, isFormChange } = this.state;
    const action = (
      <div>
        {Authorized.$hasPermission('config.edit') && <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>}
      </div>
    );
    const tabList = [
      {
        key: TAB_COMPANY,
        tab: '基本資訊',
      },
      {
        key: TAB_MAIL,
        tab: 'Email配置',
      },
    ];
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} tabList={tabList} tabActiveKey={tabActiveKey} onTabChange={this.handleTabChange} />
        <Spin tip="儲存中" spinning={loading}>
          <div style={{ display: (tabActiveKey === TAB_COMPANY) ? 'block' : 'none' }}>
            <Card style={{ margin: 20 }}>
              <ConfigCompanyForm ref={(f) => { this.configCompanyForm = f; }} isEdit={true} defaultValue={config} onValuesChange={this.handleFormChange}  />
            </Card>
          </div>
          <div style={{ display: (tabActiveKey === TAB_MAIL) ? 'block' : 'none' }}>
            <Card style={{ margin: 20 }}>
              <ConfigMailForm ref={(f) => { this.configMailForm = f; }} isEdit={true} defaultValue={config} onValuesChange={this.handleFormChange}  />
            </Card>
          </div>
          <PageFooter action={action} />
        </Spin>
      </div>
    );
  }
}

export default ConfigEdit;
