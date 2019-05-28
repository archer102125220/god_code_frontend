import _ from 'lodash';
import React from 'react';

import { Table as AntdTable } from 'antd';

import * as sorter from './sorter';
import * as filter from './filter';
import * as render from './render';

class Table extends React.Component {
  static defaultProps = {
    rowKey: 'id',
    bordered: true,
    pagination: {
      pageSize: 20,
      showQuickJumper: true,
      showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 筆 ( 共 ${total} 筆 )`,
    },
    partialSource: null,
  }

  getMappedColumns() {
    const { columns } = this.props;
    if (_.isArray(columns)) {
      const newColumns = _.map(columns, (col) => {
        if (!_.has(col, 'key') && _.has(col, 'dataIndex')) {
          _.set(col, 'key', _.get(col, 'dataIndex'));
        }
        return col;
      });
      return newColumns;
    }
    return columns;
  }

  renderRemoteTable() {
    const tableProps = _.omit(this.props, ['pagination', 'partialSource']);
    const { pagination, partialSource } = this.props;
    const { current_page, data, total, per_page } = partialSource;
    const tablePagination = {
      ...pagination,
      pageSize: per_page,
      current: current_page,
      total,
    };
    return <AntdTable {...tableProps} columns={this.getMappedColumns()} pagination={tablePagination} dataSource={data} />;
  }

  renderDataTable() {
    const tableProps = this.props;
    return <AntdTable {...tableProps} columns={this.getMappedColumns()} />;
  }

  render() {
    return _.isNull(_.get(this.props, 'partialSource', null)) ? this.renderDataTable() : this.renderRemoteTable();
  }
}

Table.Sorter = sorter;
Table.Filter = filter;
Table.Render = render;

export default Table;
