import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
} from 'antd';

import ReadonlyText from '@/components/Input/ReadonlyText';
import PhoneInput from '@/components/Input/PhoneInput';

@Form.create({
  onValuesChange: (props, changed, all) => {
    const { onValuesChange } = props;
    if (_.isFunction(onValuesChange)) {
      onValuesChange(true);
    }
  }
})
class ConfigCompany extends React.Component {
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
        <Form.Item label="公司名稱" {...this.formItemLayout}>
          {
            getFieldDecorator('company.name', {
              initialValue: _.get(defaultValue, ['company.name']),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>

        <Form.Item label="公司全銜" {...this.formItemLayout}>
          {
            getFieldDecorator('company.full_name', {
              initialValue: _.get(defaultValue, ['company.full_name']),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>

        <Form.Item label="統一編號" {...this.formItemLayout}>
          {
            getFieldDecorator('company.no', {
              initialValue: _.get(defaultValue, 'company.no'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>

        <Form.Item label="公司地址" {...this.formItemLayout}>
          {
            getFieldDecorator('company.address', {
              initialValue: _.get(defaultValue, 'company.address'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>

        <Form.Item label="電子信箱" {...this.formItemLayout}>
          {
            getFieldDecorator('company.email', {
              rules: [
                { type: 'email', message: '請輸入 正確格式' },
              ],
              initialValue: _.get(defaultValue, 'company.email'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>

        <Form.Item label="客服電話" {...this.formItemLayout}>
          {
            getFieldDecorator('company.service_phone', {
              initialValue: _.get(defaultValue, 'company.service_phone'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <PhoneInput />
            )
          }
        </Form.Item>

        <Form.Item label="聯絡電話" {...this.formItemLayout}>
          {
            getFieldDecorator('company.phone', {
              initialValue: _.get(defaultValue, 'company.phone'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <PhoneInput />
            )
          }
        </Form.Item>

        <Form.Item label="傳真" {...this.formItemLayout}>
          {
            getFieldDecorator('company.fax', {
              initialValue: _.get(defaultValue, 'company.fax'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <PhoneInput />
            )
          }
        </Form.Item>

        <Form.Item label="公司網址" {...this.formItemLayout}>
          {
            getFieldDecorator('company.url', {
              initialValue: _.get(defaultValue, ['company.url']),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>

      </Form>
    );
  }
}

export default ConfigCompany;
