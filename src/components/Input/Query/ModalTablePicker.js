import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import {
  Spin,
  Button,
  Modal,
} from 'antd';

import Table from '@/components/Table';

import { GET_query } from '@/services/query';

@connect(({ auth }) => ({ auth }))
class ModalTablePicker extends React.Component {
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
   * columns: list的欄位資訊
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

    // Table 欄位描述
    columns: PropTypes.array,
  }

  static defaultProps = {
    action: null,

    displayKey: null,
    display: null,
    readonly: false,

    onChange: () => { },
    columns: [],
  }

  state = {
    value: null,
    valuePack: null,
    list: [],
    loading: false,
    querying: false,
    showModal: false,
    selectedRowKeys: [],
    selectedRowValues: [],
  }

  getDisplayValue() {
    const { display, displayKey } = this.props;
    const { value, valuePack } = this.state;
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
    const { auth, model, action } = this.props;
    this.setState({
      querying: true,
    });
    const payload = {};
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

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      selectedRowKeys: [this.state.value],
      selectedRowValues: [this.state.valuePack],
    });
  }

  handleModalOk = () => {
    // 將selectedRowKeys的變更設定回value
    const { onChange } = this.props;
    const { selectedRowKeys, selectedRowValues } = this.state;
    const newValue = _.get(selectedRowKeys, 0, null);
    const newValuePack = _.get(selectedRowValues, 0, {});
    this.setState({
      value: newValue,
      valuePack: newValuePack,
    });
    this.toggleModal();
    onChange(newValue);
  }

  handleModalCancel = () => {
    this.toggleModal();
  }

  handleTableSelectChange = (selectedRowKeys) => {
    const { valueKey } = this.props;
    const { list } = this.state;
    const selectedRowValues = _.reduce(selectedRowKeys, (res, key) => {
      const v = _.find(list, [valueKey, key]);
      if (!_.isUndefined(v)) res.push(v);
      return res;
    }, []);

    this.setState({
      selectedRowKeys,
      selectedRowValues,
    });
  }

  renderModal() {
    const { columns, valueKey } = this.props;
    const { showModal, list, selectedRowKeys, querying } = this.state;
    return (
      <Modal
        title="Modal"
        visible={showModal}
        okText="確定"
        cancelText="取消"
        closable={false}
        maskClosable={false}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
      >
        <Table
          dataSource={list}
          columns={columns}
          rowKey={valueKey}
          rowSelection={{
            selectedRowKeys,
            type: 'radio',
            onChange: this.handleTableSelectChange,
          }}
          loading={querying}
        />
      </Modal>
    );
  }

  renderLabel() {
    const { key, readonly } = this.props;
    const { valuePack, loading } = this.state;
    if (_.isNull(valuePack) || loading) {
      return <Spin />;
    }
    return (
      <div className="ant-form-item-control">
        <label htmlFor={key}>{this.getDisplayValue()}</label>
        <span style={{ paddingLeft: 10 }}>
          {!readonly && <Button icon="search" onClick={this.toggleModal} />}
        </span>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderLabel()}
        {this.renderModal()}
      </React.Fragment>
    );
  }
}

export default ModalTablePicker;
