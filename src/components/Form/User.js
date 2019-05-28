import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import {
  Form,
  Input,
  Divider,
} from 'antd';

import Authorized from '@/components/Authorized';
import ReadonlyText from '@/components/Input/ReadonlyText';
import QuerySelect from '@/components/Input/Query/QuerySelect';

import { GET_query } from '@/services/query';
import PhoneInput from '@/components/Input/PhoneInput';

@Form.create({
  onValuesChange: (props, changed, all) => {
    const { onValuesChange } = props;
    if (_.isFunction(onValuesChange)) {
      onValuesChange(true);
    }
  }
})
@connect(({ auth }) => ({ auth }))
class User extends React.Component {
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
    validateStatus: {
      username: '',
    },
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

  setValidateStatus(field, status) {
    const { validateStatus } = this.state;
    this.setState(
      {
        validateStatus: {
          ...validateStatus,
          [field]: status,
        }
      },
    );
  }

  getValidateStatus(field) {
    const { getFieldError } = this.props.form;
    return (_.isUndefined(getFieldError(field))) ? _.get(this.state, `validateStatus.${field}`, '') : 'error';
  }

  renderProfileItem() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isReadonly, isEdit, defaultValue } = this.props;
    return (
      <React.Fragment>
        <Divider orientation="left">帳號資料</Divider>
        <Form.Item label="帳號" hasFeedback validateStatus={this.getValidateStatus('username')} {...this.formItemLayout}>
          {
            getFieldDecorator('username', {
              rules: (isEdit) ? [] : [
                {
                  required: true, transform: (value) => {
                    return _.trim(value);
                  }, message: '請輸入 帳號'
                },
                {
                  validator: (rule, value, callback, source, options) => {
                    if (_.isEmpty(_.trim(value))) return callback();
                    this.setValidateStatus('username', 'validating');
                    const { auth } = this.props;
                    const token = _.get(auth, 'token', null);
                    GET_query('user', 'checkConflict', {
                      username: value,
                    }, token).then((data) => {
                      const isConflict = _.get(data, 'conflict', false);
                      if (isConflict) {
                        this.setValidateStatus('username', 'error');
                        callback(['username conflict']);
                      } else {
                        this.setValidateStatus('username', 'success');
                        callback();
                      }
                    })
                  },
                  message: '已經有重複的帳號', trigger: ['onBlur']
                }
              ],
              initialValue: _.get(defaultValue, 'username'),
            })(
              (isReadonly || isEdit) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="姓名" {...this.formItemLayout}>
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
        <Form.Item label="所屬角色" {...this.formItemLayout}>
          {
            getFieldDecorator('role_id', {
              rules: [
                { required: true, message: '請輸入 所屬角色' },
              ],
              initialValue: _.get(defaultValue, 'role_id'),
            })(
              <QuerySelect model="role" valueKey="id" displayKey="name" readonly={isReadonly} />
            )
          }
        </Form.Item>
        <Form.Item label="電子郵件" {...this.formItemLayout}>
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
        <Form.Item label="行動電話" {...this.formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: _.get(defaultValue, 'phone'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <PhoneInput />
            )
          }
        </Form.Item>
      </React.Fragment>
    );
  }

  renderPasswordItem() {
    const { getFieldDecorator } = this.props.form;
    const { loading, isReadonly, isEdit, defaultValue } = this.props;
    if (isReadonly) return null;
    return (
      <React.Fragment>
        <Divider orientation="left">{(isEdit) ? '變更密碼' : '密碼'}</Divider>
        <Form.Item label="密碼" {...this.formItemLayout}>
          {
            getFieldDecorator('password', {
              rules: (isEdit) ? [] : [
                { required: true, message: '請輸入 密碼' },
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
        {this.renderProfileItem()}
        {this.renderPasswordItem()}
      </Form>
    );
  }

}

export default User;
