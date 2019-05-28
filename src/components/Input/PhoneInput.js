import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Input, Col, Row } from 'antd';

class PhoneInput extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    onChange: () => { },
  }

  state = {
    prefix: '',
    content: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps;
    if(!_.isEmpty(value)){
      const content_ary = _.split(value, '-');
      if(content_ary.length > 0){
        return {
          prefix: _.get(content_ary, 0, ''),
          content: _.drop(content_ary).join(''),
        };
      }
    }
    return {
      prefix: '',
      content: '',
    };
  }

  generateOnChangeEvent = (key) => {
    return (e) => {
      this.handleOnChange({
        [key]: e.target.value,
      });
    };
  }

  handleOnChange = (updateContent) => {
    const payload = _.extend(this.state, updateContent);
    const { prefix, content } = payload;
    const { onChange } = this.props;
    const value = `${prefix}-${content}`;
    onChange(value);
  }

  render() {
    const { disabled } = this.props;
    const { prefix, content } = this.state;
    return (
      <Row>
        <Col span={7}>
          <Input defaultValue={prefix} onChange={this.generateOnChangeEvent('prefix')} disabled={disabled} />
        </Col>
        <Col span={1} style={{ textAlign: 'center' }}>
          -
        </Col>
        <Col span={16}>
          <Input defaultValue={content} onChange={this.generateOnChangeEvent('content')} disabled={disabled} />
        </Col>
      </Row>
    );
  }

}

export default PhoneInput;
