/**
 * title: 檔案清單
 * breadcrumb: 檔案管理
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: file.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import { Card } from 'antd';

import Authorized from '@/components/Authorized';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';

@connect(state => ({
  files: _.get(state, 'files.list', []),
  loading: _.get(state, 'loading.effects.files/GET_files', true),
}))
class RouteTypeIndex extends React.Component {
  tableColumns = [
    {
      title: '檔案名稱',
      dataIndex: 'name',
      width: '30%',
      sorter: Table.Sorter.remoteSorter(),
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'name'))),
    },
    {
      title: '檔案類型',
      dataIndex: 'extension',
      sorter: Table.Sorter.remoteSorter(),
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'extension'))),
    },
    {
      title: '檔案目錄',
      dataIndex: 'unit',
      sorter: Table.Sorter.remoteSorter(),
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'unit'))),
    },
    {
      title: '建立時間',
      dataIndex: 'created_at',
      sorter: Table.Sorter.remoteSorter(),
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'created_at'))),
    },
    Table.Render.generateActionCol({
      showDownload: Authorized.$hasPermission('file.index'),
      onDownload: (record) => {
        this.props.dispatch({
          type: 'files/Download_file',
          payload: record,
        })
      },
    }),
  ];

  componentDidMount() {
    this.props.dispatch({
      type: 'files/GET_files',
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
      type: 'files/GET_files',
      payload,
    });
  }

  render() {
    const { files, loading } = this.props;
    return (
      <div>
        <PageHeader />
        <Card style={{ margin: 20 }}>
          <Table columns={this.tableColumns} partialSource={files} loading={loading} onChange={this.handleTableChange} />
        </Card>
      </div>
    );
  }
}

export default RouteTypeIndex;
