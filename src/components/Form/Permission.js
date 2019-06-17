import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import {
  Form,
  Spin,
  Table,
  Checkbox,
} from 'antd';

import ReadonlyText from '@/components/Input/ReadonlyText';

@Form.create({
  onValuesChange: (props, changed, all) => {
    const { onValuesChange } = props;
    if (_.isFunction(onValuesChange)) {
      onValuesChange(true);
    }
  }
})
@connect((state) => ({
  permissions: _.get(state, 'permissions', []),
  loading: _.get(state, 'loading.effects.permissions/GET_permissions', false),
}))
class Permission extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool,
    isEdit: PropTypes.bool,
    isReadonly: PropTypes.bool,
    isPreview: PropTypes.bool,
    onValuesChange: PropTypes.func,
    defaultValue: PropTypes.any,
  };

  static defaultProp = {
    isCreate: false,
    isEdit: false,
    isReadonly: false,
    isPreview: false,
  };

  state = {
    selectPermissionRowKeys: [],
  }

  permissionMap = {
    user: '用戶',
    role: '角色權限',
    eventType:'活動類型管理',
    eventAlbum:'活動類型管理',
    config: '系統配置',
    log: '日誌',
  };

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  tableColumns = [
    {
      key: 'key',
      title: '',
      dataIndex: 'key',
      render: (value, record) => {
        return _.get(this.permissionMap, value, value);
      }
    },
    {
      key: 'index',
      title: '檢視',
      dateIndex: 'index',
      render: (v, r) => this.renderPermissionCol(r, 'index'),
    },
    {
      key: 'create',
      title: '新增',
      dateIndex: 'create',
      render: (v, r) => this.renderPermissionCol(r, 'create'),
    },
    {
      key: 'edit',
      title: '編輯',
      dateIndex: 'update',
      render: (v, r) => this.renderPermissionCol(r, 'edit'),
    },
    {
      key: 'disable',
      title: '停用',
      dateIndex: 'disable',
      render: (v, r) => this.renderPermissionCol(r, 'disable'),
    },
    {
      key: 'delete',
      title: '刪除',
      dateIndex: 'delete',
      render: (v, r) => this.renderPermissionCol(r, 'delete'),
    }
  ];

  getDefaultPermissionModel = () => {
    const { permissions } = this.props;
    return _.chain(permissions)
      .map((s) => _.get(s, 'slug', null)).remove(null)
      .reduce((res, s) => _.set(res, s, false), {})
      .flatMap((actions, key) => ({
        ...actions,
        key,
      }))
      .value();
  }

  componentDidMount() {
    const { permissions } = this.props;
    if (permissions.length === 0) {
      this.props.dispatch({
        type: 'permissions/GET_permissions',
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectPermissionRowKeys } = this.state;
    const { defaultValue, permissions } = nextProps;
    if (!_.isUndefined(defaultValue) && permissions.length !== 0 && selectPermissionRowKeys.length === 0) {
      const permissionModel = _.chain(permissions)
        .map((s) => _.get(s, 'slug', null)).remove(null)
        .reduce((res, s) => _.set(res, s, _.get(defaultValue, s, false)), {})
        .value();
      const selectPermissionRowKeys = _.chain(permissionModel)
        .reduce((res, permissions, model) => {
          const isSelectAll = _.chain(permissions)
            .flatMap()
            .reduce((res, isSelect) => (res && isSelect), true)
            .value();
          if (isSelectAll) {
            res.push(model);
          }
          return res;
        }, [])
        .value();
      this.setState({
        selectPermissionRowKeys,
      });
    }
  }

  generatePermissionCheckboxChange = (permissionStr) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const [model, action] = _.split(permissionStr, '.');
    const defaultPermissionModel = this.getDefaultPermissionModel();
    return (e) => {
      const { selectPermissionRowKeys } = this.state;
      const checked = _.get(e, 'target.checked', false);
      // 當其他動作的權限被選取時，必須包含檢視權限
      if (!_.isUndefined(action) && action !== 'index' && checked) {
        setFieldsValue({
          [`${model}.index`]: true,
        });
      }
      // 當顯示權限被關閉時，一併關閉其他相關權限
      if (action === 'index' && !checked) {
        const otherPermission = _.chain(defaultPermissionModel)
          .find(['key', model])
          .keys()
          .remove((k) => _.indexOf(['key', 'index'], k) === -1)
          .map((k) => `${model}.${k}`)
          .value();
        setFieldsValue(_.reduce(otherPermission, (res, p) => {
          _.set(res, p, false);
          return res;
        }, {}));
      }
      // 當取消任何一個時，對應的model全選方塊不應該被勾選
      if (!checked) {
        _.remove(selectPermissionRowKeys, (v) => v === model);
        this.setState({
          selectPermissionRowKeys,
        });
      }
      // 當權限都被勾選時，檢查是否該model的權限都被勾選並勾取全選方塊
      if (checked) {
        const isSelectAll = _.chain(defaultPermissionModel)
          .find(['key', model])
          .keys()
          .remove((k) => _.indexOf(['key', action], k) === -1)
          .map((k) => `${model}.${k}`)
          .map(getFieldValue)
          .reduce((res, isSelect) => (res && isSelect), true)
          .value();
        if (isSelectAll) {
          this.setState({
            selectPermissionRowKeys: _.concat(selectPermissionRowKeys, [model]),
          });
        }
      }

    }
  }

  renderPermissionCol = (record, action) => {
    const { defaultValue } = this.props;
    const _value = _.get(record, action);
    if (_.isUndefined(_value) || !_.has(record, 'key')) return '-';
    const permissionStr = `${_.get(record, 'key')}.${action}`;
    const value = _.get(defaultValue, permissionStr, _value);
    return this.renderPermissionCheckbox(permissionStr, {
      valuePropName: 'checked',
      initialValue: value,
      onChange: this.generatePermissionCheckboxChange(permissionStr),
    });
  }

  renderPermissionCheckbox = (fieldName, fieldProps) => {
    const { getFieldDecorator } = this.props.form;
    const { isReadonly } = this.props;
    return getFieldDecorator(fieldName, fieldProps)(
      (isReadonly) ?
        <ReadonlyText valuePropName="checked" converter={(v) => (v) ? 'V' : 'X'} />
        : <Checkbox />
    );
  }

  renderPermissionTable = () => {
    const permissionList = this.getDefaultPermissionModel();
    const { isReadonly } = this.props;
    const { setFieldsValue } = this.props.form;
    const { selectPermissionRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: selectPermissionRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        const defaultPermissionModel = this.getDefaultPermissionModel();
        const addList = _.difference(selectedRowKeys, selectPermissionRowKeys);
        const delList = _.difference(selectPermissionRowKeys, selectedRowKeys);
        const getPermissionsByModel = (model) => {
          return _.chain(defaultPermissionModel)
            .find(['key', model])
            .keys()
            .remove((k) => _.indexOf(['key'], k) === -1)
            .map((k) => `${model}.${k}`)
            .value();
        }
        const reduceToFields = (permissionList, value) => {
          return _.reduce(permissionList, (res, p) => {
            _.set(res, p, value);
            return res;
          }, {});
        }
        const changeFields = _.extend(reduceToFields(_.flatten(_.map(addList, getPermissionsByModel)), true), reduceToFields(_.flatten(_.map(delList, getPermissionsByModel)), false));
        setFieldsValue(changeFields);
        this.setState({
          selectPermissionRowKeys: selectedRowKeys,
        });
      },
    }
    return <Table columns={this.tableColumns} rowSelection={(isReadonly) ? null : rowSelection} pagination={false} dataSource={permissionList} />;
  }

  render() {
    const { loading } = this.props;
    return (
      <Form>
        <Spin tip="載入中" spinning={loading}>
          {this.renderPermissionTable()}
        </Spin>
      </Form>
    );
  }
}

export default Permission;
