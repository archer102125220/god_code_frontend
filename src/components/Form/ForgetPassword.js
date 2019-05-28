import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Icon,
  Input,
} from 'antd';

import styles from './ForgetPassword.css';

@Form.create()
class ForgetPassword extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    loading: false,
    onSubmit: (err, values) => { }
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      _.invoke(this.props, 'onSubmit', err, values);
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      this.handleSubmit();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;

    const IconUser = (<Icon type="user" className={styles.prefix_icon} />);
    const IconEmail = (<Icon type="mail" className={styles.prefix_icon} />);

    return (
      <Form className={styles.content} onKeyPress={this.handleKeyPress}>
        <Form.Item>
          {
            getFieldDecorator('username', {
              rules: [
                { required: true, message: '請輸入 帳號' },
              ],
            })(
              <Input size="large" className={styles.input} prefix={IconUser} placeholder="帳號" disabled={loading} />,
            )
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('email', {
              rules: [
                { type: 'email', message: '請輸入 正確格式' },
                { required: true, message: '請輸入 電子郵件地址' },
              ],
            })(
              <Input size="large" className={styles.input} prefix={IconEmail} placeholder="電子郵件地址" disabled={loading} />,
            )
          }
        </Form.Item>
      </Form>
    );
  }
}

export default ForgetPassword;
