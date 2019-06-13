/**
 * title: 活動集錦清單
 * breadcrumb: 活動集錦管理
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventAlbum.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';

import { Button, Card } from 'antd';

import Authorized from '@/components/Authorized';

import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';

import FilePickerModal from '@/components/Input/FilePickerModal';

@connect(state => ({
  authEventAlbum: _.get(state, 'auth.eventAlbum', {}),
  eventAlbums: _.get(state, 'eventAlbums.list', {}),
  eventAlbumsQuery: _.get(state, 'eventAlbums.listQuery', {}),
  loading: _.get(state, 'loading.effects.eventAlbums/GET_eventAlbums', true) || _.get(state, 'loading.effects.eventAlbums/DELETE_eventAlbum', false) || _.get(state, 'loading.effects.eventAlbums/CHANGESTATUS_eventAlbum', false),
}))
class EventAlbumIndex extends React.Component {

  getTableColumns() {
    return [
      {
        title: '活動集錦',
        dataIndex: 'event_albums',
        ...Table.Sorter.remoteSorter(Table.Sorter.byRemote(), _.get(this.props, ['eventAlbumsQuery', 'orderBy', 'event_albums'])),
        ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'event_albums'), _.get(this.props, ['eventAlbumsQuery', 'filter', 'event_albums']))),
      },
      {
        title: '活動類型',
        dataIndex: 'event_type.event_types',
        ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'event_type.event_types'), _.get(this.props, ['eventAlbumsQuery', 'filter', 'event_type.event_types']))),
      },
      Table.Filter.remoteFilter(Table.Render.generateEnabledStatusCol(_.get(this.props, ['eventAlbumsQuery', 'filter', 'deleted_at']))),
      Table.Render.generateActionCol({
        showDetail: true,
        onDetail: (record) => router.push(`/eventAlbum/${record.id}`),
        showEdit: Authorized.$hasPermission('eventAlbum.edit'),
        onEdit: (record) => router.push(`/eventAlbum/${record.id}/edit`),
        showDelete: Authorized.$hasPermission('eventAlbum.delete'),
        onDelete: (record) => this.props.dispatch({
          type: 'eventAlbums/DELETE_eventAlbum',
          payload: record,
        }),
        showStatus: Authorized.$hasPermission('eventAlbum.disable'),
        onStatus: (record, status) => this.props.dispatch({
          type: 'eventAlbums/CHANGESTATUS_eventAlbum',
          payload: {
            id: _.get(record, 'id'),
            status,
          },
        }),
        render: (text, record, defaultRender) => {
          const { authEventAlbum } = this.props;
          if (_.get(record, 'id') === _.get(authEventAlbum, 'id')) {
            return defaultRender({
              showDelete: false,
              showStatus: false,
            });
          }
          return defaultRender();
        }
      }),
    ];
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'eventAlbums/GET_eventAlbums',
      payload: _.get(this.props, 'eventAlbumsQuery', {}),
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
      type: 'eventAlbums/GET_eventAlbums',
      payload,
    });
  }

  render() {
    const { eventAlbums, loading } = this.props;
    const action = (
      <div>
        {Authorized.$hasPermission('eventAlbum.create') && <Button type="primary" icon="plus" onClick={() => router.push('/eventAlbum/create')}>新增</Button>}
      </div>
    );
    return (
      <div>
        <PageHeader action={action} />
        <Card style={{ margin: 20 }}>
          <Table columns={this.getTableColumns()} partialSource={eventAlbums} loading={loading} onChange={this.handleTableChange} />
        </Card>
      </div>
    );
  }
}

export default EventAlbumIndex;
