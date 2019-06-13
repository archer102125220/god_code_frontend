/**
 * title: 詳細資料
 * breadcrumb: 詳細
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventType.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';


import { Button, Card, Spin } from 'antd';

import PageLoading from '@/components/PageLoading';
import PageHeader from '@/components/PageHeader';
import EventTypeForm from '@/components/Form/EventType';

@connect(state => ({
  eventType: _.get(state, 'eventTypes.detail', {}),
  loading: _.get(state, 'loading.effects.eventTypes/GET_eventType', false),
}))

class EventTypeDetail extends React.Component {
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

  componentDidMount() {
    this.getEventType();
  }

  render() {
    const { eventType, loading } = this.props;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/eventType')}>返回</Button>
      </div>
    );
    return (
      <PageLoading isLoading={_.isNull(eventType)}>
        <PageHeader action={action} />
        <Spin tip="載入中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <EventTypeForm isReadonly={true} defaultValue={eventType} />
          </Card>
        </Spin>
      </PageLoading>
    );
  }
}

export default EventTypeDetail;
