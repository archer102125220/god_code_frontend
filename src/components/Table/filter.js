/**
 * 表格的過濾器
 */

import _ from 'lodash';
import React from 'react';

import { Input, Button } from 'antd';

import styles from './filter.css';

/**
 * 過濾方法
 */

// 相同內容
export function sameValue(value, record) {
  return value == record; // eslint-disable-line eqeqeq
}

// 相似文字
export function likeText(value, record) {
  return _.toString(record).includes(value);
}

// 展開欄位資料
export function wrapRecord(filterFunc, key, defaultValue) {
  return (value, record) => filterFunc(value, _.get(record, key, defaultValue));
}


/**
 * 產生表格的過濾器建構器設定
 */

export function generateListFilter(items, filterFunc, filterMultiple = true) {
  return {
    filters: items,
    filterMultiple,
    onFilter: filterFunc,
  }
}

export function generateInputFilter(filterFunc) {
  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      return (
        <div className={styles.inputfilter_dropdown}>
          <Input
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
          />
          <Button type="primary" onClick={confirm}>篩選</Button>
          <Button onClick={clearFilters}>重置</Button>
        </div>
      );
    },
    onFilter: filterFunc,
  }
}

// 交由伺服器進行過濾
export function remoteFilter(filterProps) {
  return _.omit(filterProps, ['onFilter']);
}
