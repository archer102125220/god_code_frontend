import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Checkbox,
} from 'antd';

import ReadonlyText from '@/components/Input/ReadonlyText';

@Form.create({
  onValuesChange: (props, changed, all) => {
    const { onValuesChange } = props;
    if (_.isFunction(onValuesChange)) {
      onValuesChange(changed, all);
    }
  }
})
class Role extends React.Component {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isReadonly, defaultValue } = this.props;
    return (
      <Form>
        <Form.Item label="角色名稱" {...this.formItemLayout}>
          {
            getFieldDecorator('name', {
              rules: [
                { required: true, message: '請輸入 角色名稱' },
              ],
              initialValue: _.get(defaultValue, 'name'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="角色設定" {...this.formItemLayout}>
          {
            getFieldDecorator('allpermission', {
              valuePropName: 'checked',
              initialValue: _.get(defaultValue, 'allpermission', false),
            })(
              (isReadonly) ?
                <ReadonlyText valuePropName="checked" converter={v => ((v) ? '開啟所有權限' : '僅包含被指定之權限')} />
                :
                <Checkbox>開啟所有權限</Checkbox>
            )
          }
          <br />
        </Form.Item>
        <Form.Item label="角色描述" {...this.formItemLayout}>
          {
            getFieldDecorator('description', {
              initialValue: _.get(defaultValue, 'description')
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input.TextArea rows={5} disabled={loading} />
            )
          }
        </Form.Item>
      </Form>
    );
  }

}

export default Role;
