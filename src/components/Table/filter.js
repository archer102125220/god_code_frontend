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

// 根據提供的預設值進行封裝
function wrapDefaultFilterValue(filter, defaultFilterValue) {
  return _.isUndefined(defaultFilterValue) ? filter : {
    ...filter,
    filteredValue: _.isArray(defaultFilterValue) ? defaultFilterValue : [defaultFilterValue],
  }
}

/**
 * 產生表格的過濾器建構器設定
 */

export function generateListFilter(items, filterFunc, filterMultiple = true, defaultFilterValue) {
  return wrapDefaultFilterValue({
    filters: items,
    filterMultiple,
    onFilter: filterFunc,
  }, defaultFilterValue);
}

export function generateInputFilter(filterFunc, defaultFilterValue) {
  return wrapDefaultFilterValue({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      return (
        <div className={styles.inputfilter_dropdown}>
          <Input
            value={!_.isEmpty(selectedKeys) ? selectedKeys[0] : null}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : undefined)}
            onPressEnter={confirm}
          />
          <Button type="primary" onClick={confirm}>篩選</Button>
          <Button onClick={clearFilters}>重置</Button>
        </div>
      );
    },
    onFilter: filterFunc,
  }, defaultFilterValue);
}

// 交由伺服器進行過濾
export function remoteFilter(filterProps) {
  return _.omit(filterProps, ['onFilter']);
}
