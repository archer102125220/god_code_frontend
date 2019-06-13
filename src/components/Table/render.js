/**
 * 一些常用的欄位渲染
 */

import _ from 'lodash';
import React from 'react';

import { Badge, Checkbox } from 'antd';

import GPSMapButton from '@/components/Input/GPSMapButton';

import ActionCol from './ActionCol';

import * as filter from './filter';
import * as sorter from './sorter';
const Table = {
  Filter: filter,
  Sorter: sorter,
};

// 產生業者名稱顯示
export function generateVendorNameCol(_config = {}) {
  const baseConfig = {
    key: 'vendor_name',
    title: '所屬業者',
    render: (text, record) => {
      const vendor = _.get(record, 'vendor');
      if (_.isNull(vendor)) return '系統管理員';
      return _.get(vendor, 'name', '-');
    }
  };
  return _.extend(baseConfig, _config);
}

// 產生啟用停用狀態顯示
export function generateEnabledStatusCol(defaultFilterValue) {
  return {
    key: 'deleted_at',
    title: '狀態',
    dataIndex: 'deleted_at',
    width: '85px',
    ...Table.Filter.generateListFilter([
      { text: '啟用', value: 'null' },
      { text: '停用', value: 'notnull' },
    ], Table.Filter.wrapRecord((value, record) => {
      if (_.isUndefined(record)) return true;
      switch (value) {
        case 'null':
          return _.isNull(record);
        case 'notnull':
          return !_.isNull(record);
        default:
          return true;
      }
    }, 'deleted_at'), true, defaultFilterValue),
    render: (text, record) => {
      if (!_.has(record, 'deleted_at')) return null;
      if (_.isNull(text)) {
        return <Badge status="success" text="啟用" />;
      } else {
        return <Badge status="default" text="停用" />;
      }
    }
  }
}

/**
 * 產生系統操作
 *
 * config
 * {
 *  render
 *  showDetail, onDetail(record)
 *  showEdit, onEdit(record)
 *  showDelete, onDelete(record)
 *  showStatus, onStatus(record, newStatus)  //啟用
 * }
 */
export function generateActionCol(_config) {
  const showName = ['showDetail', 'showEdit', 'showDelete', 'showStatus'];
  let width = 0;
  _.map(showName, (name) => {
    if (_.get(_config, name, false)) {
      width += 60;
    }
  });
  return {
    key: 'action',
    title: '動作',
    width,
    render: (text, record) => {
      if (width === 0) {
        return "無";
      }
      const defaultRender = (extendsProps = {}) => {
        const config = _.clone(_config);
        return <ActionCol text={text} record={record} {..._.extend(config, extendsProps)} />;
      }
      const renderFunc = _.get(_config, 'render', null);
      if (_.isFunction(renderFunc)) {
        return _.invoke(_config, 'render', text, record, defaultRender);
      }
      return defaultRender();
    }
  }
}


/**
 * 產生單選選擇框
 *
 */
export function generateCheckboxCol(getCheckboxProps = () => { }) {
  return {
    key: 'table_checkbox',
    render: (text, record) => {
      return <Checkbox {...getCheckboxProps(text, record)} />;
    }
  }
}

/**
 * 產生GPS地圖檢視按鈕
 *
 */
export function generateGPSPreview() {
  return {
    key: 'table_gpspreview',
    title: '位置',
    render: (text, record) => {
      return <GPSMapButton {..._.pick(record, ['latitude', 'longitude'])} />;
    }
  }
}
