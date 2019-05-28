/**
 * title: 日誌清單
 * breadcrumb: 日誌
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: log.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import { Card, Drawer, Spin } from 'antd';

import Authorized from '@/components/Authorized';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';

@connect(state => ({
  log: _.get(state, 'logs.detail', {}),
  logs: _.get(state, 'logs.list', {}),
  loading: _.get(state, 'loading.effects.logs/GET_logs', true) || _.get(state, 'loading.effects.logs/GET_log', false),
}))
class LogIndex extends React.Component {
  getLogId = () => {
    const { match } = this.props;
    return _.toInteger(_.get(match, 'params.id', 1));
  }

  getLog = () => {
    const id = this.getLogId();
    this.props.dispatch({
      type: 'logs/GET_log',
      payload: {
        id,
      },
    });
  }

  tableColumns = [
    {
      title: '使用者',
      dataIndex: 'creator.username',
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'creator.username'))),
    },
    {
      title: '事件類型',
      dataIndex: 'type',
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'type'))),
    },
    {
      title: '事件項目',
      dataIndex: 'action',
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'action'))),
    },
    {
      title: '建立日期',
      dataIndex: 'created_at',
      sorter: Table.Sorter.remoteSorter(),
      ...Table.Filter.remoteFilter(Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'created_at'))),
    },
    Table.Render.generateActionCol({
      showDetail: true,
      onDetail: (record) => {
        this.setState({
          logsDetailVisible: true,
          logsDetailData: record,
        });
      },
    }),
  ];

  state = {
    logsDetailVisible: false,
    logsDetailData: {},
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'logs/GET_logs',
      payload: {},
    });
    this.getLog();
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
      type: 'logs/GET_logs',
      payload,
    });
  }


  handleLogsDetailOnClose = () => {
    this.setState({
      logsDetailVisible: false,
    });
  }

  renderLogsDetailDrawer = () => {
    const { logsDetailVisible, logsDetailData } = this.state;
    const creator = _.get(logsDetailData, 'creator.username');
    const { type, action, data, created_at } = logsDetailData;
    return (
      <Drawer
        title="詳細資料"
        placement="right"
        onClose={this.handleLogsDetailOnClose}
        visible={logsDetailVisible}
        width={800}
      >
        <div>使用者：</div>
        <div style={{ margin: 10 }}>{creator}</div>
        <div>事件類型：</div>
        <div style={{ margin: 10 }}>{type}</div>
        <div>事件項目：</div>
        <div style={{ margin: 10 }}>{action}</div>
        <div>事件內容：</div>
        <div dangerouslySetInnerHTML={{ __html: data }} style={{ margin: 10 }} />
        <div>建立日期：</div>
        <div style={{ margin: 10 }}>{created_at}</div>
      </Drawer>
    )
  }

  render() {
    const { logs, loading } = this.props;
    return (
      <div>
        <PageHeader />
        <Card style={{ margin: 20 }}>
          <Table columns={this.tableColumns} partialSource={logs} loading={loading} onChange={this.handleTableChange} />
        </Card>
        {this.renderLogsDetailDrawer()}
      </div>
    );
  }
}

export default LogIndex;
