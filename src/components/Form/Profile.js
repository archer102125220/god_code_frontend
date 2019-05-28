import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  Input,
} from 'antd';

import ReadonlyText from '@/components/Input/ReadonlyText';
import PhoneInput from '@/components/Input/PhoneInput';

@Form.create()
class Profile extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool,
    isEdit: PropTypes.bool,
    isReadonly: PropTypes.bool,
    isPreview: PropTypes.bool,
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

  renderProfileItem() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isReadonly, defaultValue } = this.props;
    return (
      <React.Fragment>
        <Form.Item label="帳號">
          <ReadonlyText value={_.get(defaultValue, 'username')} />
        </Form.Item>
        <Form.Item label="姓名">
          {
            getFieldDecorator('name', {
              rules: [
                { required: true, message: '請輸入 姓名' },
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
        <Form.Item label="電子郵件">
          {
            getFieldDecorator('email', {
              rules: [
                { required: true, message: '請輸入 電子郵件' },
                { type: 'email', message: '請輸入 正確格式' },
              ],
              initialValue: _.get(defaultValue, 'email'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="行動電話">
          {
            getFieldDecorator('phone', {
              initialValue: _.get(defaultValue, 'phone'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <PhoneInput disabled={loading} />
            )
          }
        </Form.Item>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Form>
        {this.renderProfileItem()}
      </Form>
    );
  }

}

export default Profile;
