/**
 * title: 活動類型清單
 * breadcrumb: 活動類型管理
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventtype.index
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
  eventTypes: _.get(state, 'eventTypes.list', {}),
  loading: _.get(state, 'loading.effects.eventTypes/GET_eventTypes', true) || _.get(state, 'loading.effects.eventTypes/DELETE_eventType', false) || _.get(state, 'loading.effects.eventTypes/CHANGESTATUS_eventType', false),
}))
class EventTypeIndex extends React.Component {
  tableColumns = [
    {
      title: '活動類型',
      dataIndex: 'event_types',
      sorter: Table.Sorter.remoteSorter(),
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'event_types'))),
    },
    Table.Filter.remoteFilter(Table.Render.generateEnabledStatusCol()),
    Table.Render.generateActionCol({
      showDetail: true,
      onDetail: (record) => router.push(`/eventType/${record.id}`),
      showEdit: Authorized.$hasPermission('eventtype.edit'),
      onEdit: (record) => router.push(`/eventType/${record.id}/edit`),
      showDelete: Authorized.$hasPermission('eventtype.delete'),
      onDelete: (record) => this.props.dispatch({
        type: 'eventTypes/DELETE_eventType',
        payload: record,
      }),
      showStatus: Authorized.$hasPermission('eventtype.disable'),
      onStatus: (record, status) => this.props.dispatch({
        type: 'eventTypes/CHANGESTATUS_eventType',
        payload: {
          id: _.get(record, 'id'),
          status,
        },
      }),
    }),
  ];

  componentDidMount() {
    this.props.dispatch({
      type: 'eventTypes/GET_eventTypes',
      payload: {},
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    const filter = _.reduce(filters, (res, value, key) => {
      if (_.isArray(value)) {
        if (value.length === 1) {
          return {
            ...res,
            [key]: value[0]
          }
        }
      }
      return {
        ...res,
        [key]: value,
      };
    }, {});
    const orderBy = (_.has(sorter, 'order')) ? {
      [_.get(sorter, 'columnKey')]: _.get(sorter, 'order')
    } : null;
    const payload = {
      page: current,
      filter,
    }
    if (!_.isNull(orderBy)) {
      _.set(payload, 'orderBy', orderBy);
    }
    this.props.dispatch({
      type: 'eventTypes/GET_eventTypes',
      payload,
    });
  }

  render() {
    const { eventTypes, loading } = this.props;
    const action = (
      <div>
        {Authorized.$hasPermission('eventtype.create') && <Button type="primary" icon="plus" onClick={() => router.push('/eventType/create')}>新增</Button>}
      </div>
    );
    return (
      <div>
        <PageHeader action={action} />
        <Card style={{ margin: 20 }}>
          <Table columns={this.tableColumns} partialSource={eventTypes} loading={loading} onChange={this.handleTableChange} />
        </Card>
      </div>
    );
  }
}

export default EventTypeIndex;
