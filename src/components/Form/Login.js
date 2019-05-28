import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Icon,
  Input,
} from 'antd';

import styles from './Login.css';

@Form.create()
class Login extends React.Component {
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
    const IconLock = (<Icon type="lock" className={styles.prefix_icon} />);

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
            getFieldDecorator('password', {
              rules: [
                { required: true, message: '請輸入 密碼' }
              ],
            })(
              <Input size="large" className={styles.input} prefix={IconLock} type="password" placeholder="密碼" disabled={loading} />,
            )
          }
        </Form.Item>
      </Form>
    );
  }
}

export default Login;
