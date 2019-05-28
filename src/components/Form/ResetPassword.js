import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  Input,
  Divider,
} from 'antd';

@Form.create()
class ResetPassword extends React.Component {
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

  renderPasswordItem() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isReadonly, isEdit, defaultValue } = this.props;
    if (isReadonly) return null;
    return (
      <React.Fragment>
        <Form.Item>
          {
            getFieldDecorator('password', {
              rules: (isEdit) ? [] : [
                { required: true, message: '請輸入 新密碼' },
              ],
              initialValue: _.get(defaultValue, 'password'),
            })(
              <Input type="password" size="large" placeholder="新密碼" disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('password_confirmation', {
              rules: (isEdit) ? [
                {
                  validator: (rule, value, callback, source, options) => {
                    const { getFieldValue, setFieldsValue } = this.props.form;
                    const password = getFieldValue('password');
                    if (_.isEmpty(password)) {
                      setFieldsValue({
                        'password': null,
                      });
                      return callback();
                    }
                    if (_.isEqual(password, value)) {
                      callback();
                    } else {
                      callback(['require same password']);
                    }
                  },
                  message: '請再次輸入密碼'
                }
              ] : [
                  { required: true, message: '請輸入 密碼確認' },
                  {
                    validator: (rule, value, callback, source, options) => {
                      const { getFieldValue } = this.props.form;
                      const password = getFieldValue('password');
                      if (_.isEqual(password, value)) {
                        callback();
                      } else {
                        callback(['require same password']);
                      }
                    },
                    message: '請再次輸入密碼'
                  }
                ],
              initialValue: _.get(defaultValue, 'password_confirmation'),
            })(
              <Input type="password" size="large" placeholder="密碼確認" disabled={loading} />
            )
          }
        </Form.Item>
      </React.Fragment>
    )
  }

  render() {
    return (
      <Form>
        {this.renderPasswordItem()}
      </Form>
    );
  }

}

export default ResetPassword;
