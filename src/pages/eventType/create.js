/**
 * title: 建立活動類型
 * breadcrumb: 建立
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventType.create
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';

import EventTypeForm from '@/components/Form/EventType';

@connect(state => ({
  auth: _.get(state, 'auth', {}),
  loading: _.get(state, 'loading.effects.eventTypes/POST_eventType', false),
}))
class EventTypeCreate extends React.Component {
  state = {
    isFormChange: false,
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'eventTypeForm.validateFields')) return null;
    this.eventTypeForm.validateFields((err, values) => {
      if (err) return err;
      this.props.dispatch({
        type: 'eventTypes/POST_eventType',
        payload: values,
        callback: () => router.push('/eventType'),
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
        <Button icon="close" onClick={() => router.push('/eventType')}>取消</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} />
        <Spin tip="儲存中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <EventTypeForm ref={(f) => { this.eventTypeForm = f; }} isCreate={true} onValuesChange={this.handleFormChange} />
          </Card>
        </Spin>
        <PageFooter action={action} />
      </div>
    );
  }
}

export default EventTypeCreate;
