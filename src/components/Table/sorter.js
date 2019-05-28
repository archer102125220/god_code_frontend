/**
 * 表格的排序邏輯
 */

import _ from 'lodash';

// 文字排序
export function byText(a, b) {
  return a.localeCompare(b, "zh-Hant");
}

// 根據數字排序
export function byNumber(a, b) {
  return _.toNumber(a) - _.toNumber(b);
}

// 以文字長度排序
export function byLength(a, b) {
  return _.toString(a).length - _.toString(b).length;
}

// 根據物件中的單個屬性內容排序
export function wrapValue(sortFunc, key, defaultValue) {
  return (a, b) => sortFunc(_.get(a, key, defaultValue), _.get(b, key, defaultValue));
}

// 根據多個條件依序排序
export function multiLevel(...funcs) {
  return (a, b) => {
    return _.reduce(funcs, (res, func) => {
      if (res !== 0) return res;
      res = func(a, b);
      return res;
    }, 0);
  }
}

// 交由伺服器排序
export function remoteSorter() {
  return true;
}

