import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import {
  Form,
  Input,
} from 'antd';

@Form.create()
class ChangePassword extends React.Component {
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

  renderPasswordItem() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isReadonly, isEdit, defaultValue } = this.props;
    if (isReadonly) return null;
    return (
      <React.Fragment>
        <Form.Item label="原密碼" {...this.formItemLayout}>
          {
            getFieldDecorator('password_old', {
              rules: [
                { required: true, message: '請輸入 新密碼' },
              ],
              initialValue: _.get(defaultValue, 'password_old'),
            })(
              <Input type="password" disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="新密碼" {...this.formItemLayout}>
          {
            getFieldDecorator('password', {
              rules: [
                { required: true, message: '請輸入 新密碼' },
              ],
              initialValue: _.get(defaultValue, 'password'),
            })(
              <Input type="password" disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="密碼確認" {...this.formItemLayout}>
          {
            getFieldDecorator('password_confirmation', {
              rules: [
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
                  message: '請再次輸入新密碼'
                }
              ],
              initialValue: _.get(defaultValue, 'password_confirmation'),
            })(
              <Input type="password" disabled={loading} />
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

export default ChangePassword;
