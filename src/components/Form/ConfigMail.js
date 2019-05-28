import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Radio,
  Divider,
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
class ConfigMail extends React.Component {
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
        <Divider orientation="left">寄件方式</Divider>
        <Form.Item label="傳送方式" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.driver', {
              initialValue: _.get(defaultValue, 'mail.driver', 'smtp'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                (
                  <Radio.Group>
                    <Radio.Button value="smtp">SMTP</Radio.Button>
                  </Radio.Group>
                )
            )
          }
        </Form.Item>
        <Form.Item label="主機" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.host', {
              initialValue: _.get(defaultValue, 'mail.host'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="通訊埠" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.port', {
              initialValue: _.get(defaultValue, 'mail.port'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="帳號" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.username', {
              rules: [],
              initialValue: _.get(defaultValue, 'mail.username'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="密碼" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.password', {
              initialValue: _.get(defaultValue, 'mail.password'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} type="password"/>
            )
          }
        </Form.Item>
        <Form.Item label="加密方法" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.encryption', {
              initialValue: _.get(defaultValue, 'mail.encryption', null),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                (
                  <Radio.Group>
                    <Radio.Button value={null}>無</Radio.Button>
                    <Radio.Button value="tls">TLS</Radio.Button>
                  </Radio.Group>
                )
            )
          }
        </Form.Item>
        <Divider orientation="left">寄件資訊</Divider>
        <Form.Item label="寄件人" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.from_name', {
              initialValue: _.get(defaultValue, 'mail.from_name'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="寄件地址" {...this.formItemLayout}>
          {
            getFieldDecorator('mail.from_address', {
              rules: [
                { type: 'email', message: '請輸入 正確格式' },
              ],
              initialValue: _.get(defaultValue, 'mail.from_address'),
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

export default ConfigMail;
