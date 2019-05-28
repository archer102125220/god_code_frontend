/**
 * title: 編輯活動類型
 * breadcrumb: 編輯
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventtype.edit
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageLoading from '@/components/PageLoading';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import EventTypeForm from '@/components/Form/EventType';

@withRouter
@connect(state => ({
  eventType: _.get(state, 'eventTypes.detail', []),
  loading: _.get(state, 'loading.effects.eventTypes/GET_eventType', false) ||  _.get(state, 'loading.effects.eventTypes/PATCH_eventType', false),
}))
class EventTypeEdit extends React.Component {
  state = {
    isFormChange: false,
  }

  getEventTypeId = () => {
    const { match } = this.props;
    return _.toInteger(_.get(match, 'params.id', -1));
  }

  getEventType = () => {
    const id = this.getEventTypeId();
    this.props.dispatch({
      type: 'eventTypes/GET_eventType',
      payload: {
        id,
      },
    });
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'eventTypeForm.validateFields')) return null;
    const id = this.getEventTypeId();
    if (_.isNull(id)) return null;
    this.eventTypeForm.validateFields((err, values) => {
      if (err) return err;
      this.props.dispatch({
        type: 'eventTypes/PATCH_eventType',
        payload: {
          id,
          data: values,
        },
        callback: () => router.push('/eventType'),
      });
    });
  }

  componentDidMount() {
     this.getEventType();
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
    const { eventType } = this.props;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/eventType')}>取消</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <PageLoading isLoading={_.isNull(eventType)}>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} />
        <Spin tip="處理中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <EventTypeForm ref={(f) => { this.eventTypeForm = f; }} isEdit={true} defaultValue={eventType} onValuesChange={this.handleFormChange} />
          </Card>
        </Spin>
        <PageFooter action={action} />
      </PageLoading>
    );
  }
}

export default EventTypeEdit;
