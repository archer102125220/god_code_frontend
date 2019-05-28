import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import {
  Spin,
  Button,
  Select as AntdSelect,
} from 'antd';

import { GET_query } from '@/services/query';

@connect(({ auth }) => ({ auth }))
class QuerySelect extends React.Component {
  /**
   * model: GET_query參數
   * action: GET_query參數
   *
   * valueKey: 選擇資料時作為回傳的鍵
   * displayKey: 顯示資料時使用的鍵
   * display: 顯示資料時會執行的方法，用於客製顯示，指定時會忽略displayKey的設定
   *
   * readonly: 唯讀狀態，當唯讀狀態時不可進行選取
   *
   * nullable: 是否包含空值的選項
   * nullDisplay: 資料為空時的顯示文字
   */
  static propTypes = {
    // 基礎設定，用於 GET_query 參數
    model: PropTypes.string.isRequired,
    action: PropTypes.string,

    // 顯示模式
    valueKey: PropTypes.string.isRequired,
    displayKey: PropTypes.string,
    display: PropTypes.func,
    readonly: PropTypes.bool,

    // 資料變更事件
    onChange: PropTypes.func,
    listQueryPayload: PropTypes.obj,

    // 空值處理
    nullable: PropTypes.bool,
    nullDisplay: PropTypes.string,
  }

  static defaultProps = {
    action: null,

    displayKey: null,
    display: null,
    readonly: false,

    onChange: () => { },
    listQueryPayload: {},

    nullable: false,
    nullDisplay: '無',
  }

  state = {
    value: null,
    valuePack: null,
    loading: false,
    querying: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, valueKey } = nextProps;
    const { list } = prevState;
    const valuePack = _.find(list, [valueKey, value]) || {};
    return {
      ...prevState,
      value,
      valuePack,
    }
  }

  getDisplayValue() {
    const { display, displayKey, nullDisplay } = this.props;
    const { value, valuePack } = this.state;
    if (_.isNull(value)) return nullDisplay;
    if (_.isNull(display)) {
      return _.get(valuePack, displayKey, value);
    } else {
      return display(value, valuePack);
    }
  }

  setValue(value) {
    const { valuePack } = this.state;
    if (_.isNull(valuePack)) {
      this.fetchValuePackByValue(value);
    }
    this.setState({
      value,
    });
  }

  setValuePack(valuePack = null) {
    this.setState({
      valuePack,
    })
  }

  fetchValuePackByValue(value) {
    const { auth, model, action, valueKey } = this.props;
    this.setState({
      loading: true,
    });
    const payload = {
      filter: {
        [valueKey]: value,
      },
    };
    const token = _.get(auth, 'token', null);
    GET_query(model, action, payload, token).then(data => {
      const dataPack = _.isArray(data) ? _.get(data, 0, {}) : data;
      this.setValuePack(dataPack);
      this.setState({
        loading: false,
      });
    });
  }

  fetchList() {
    const { auth, model, action, listQueryPayload } = this.props;
    this.setState({
      querying: true,
    });
    const payload = listQueryPayload;
    const token = _.get(auth, 'token', null);
    GET_query(model, action, payload, token).then(data => {
      this.setState({
        querying: false,
        list: data,
      });
    });
  }

  componentDidMount() {
    const { value } = this.props;
    this.setValue(value);
    this.fetchList();
  }

  handleSelectChange = (value) => {
    const { valueKey, onChange } = this.props;
    const { list } = this.state;
    const valuePack = _.find(list, [valueKey, value]) || {};
    this.setState({
      value,
      valuePack,
    });
    onChange(value);
  }

  renderSelect() {
    const { display, displayKey, valueKey, nullable, nullDisplay } = this.props;
    const { value, list, querying } = this.state;
    if (querying) {
      return <Spin />;
    }
    const renderDisplay = (vp) => {
      if (_.isNull(display)) {
        return _.get(vp, displayKey);
      } else {
        return display(value, vp);
      }
    }
    return (
      <AntdSelect defaultValue={value} value={value} onChange={this.handleSelectChange}>
        {
          nullable && <AntdSelect.Option key={`queryselect_null}`} value={null}>{nullDisplay}</AntdSelect.Option>
        }
        {
          _.map(list, (vp) => {
            return (
              <AntdSelect.Option key={`queryselect_${_.get(vp, valueKey)}`} value={_.get(vp, valueKey)}>{renderDisplay(vp)}</AntdSelect.Option>
            );
          })
        }
      </AntdSelect>
    )
  }

  renderLabel() {
    const { key } = this.props;
    const { valuePack, loading } = this.state;
    if (_.isNull(valuePack) || loading) {
      return <Spin />;
    }
    return (
      <label htmlFor={key}>{this.getDisplayValue()}</label>
    );
  }

  render() {
    const { readonly } = this.props;
    return (
      <div className="ant-form-item-control">
        {(readonly) ? this.renderLabel() : this.renderSelect()}
      </div>
    );
  }
}

export default QuerySelect;
