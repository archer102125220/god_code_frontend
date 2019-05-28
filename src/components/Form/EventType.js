import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
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
class EventType extends React.Component {
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
        <Form.Item label="活動類型" {...this.formItemLayout}>
          {
            getFieldDecorator('event_types', {
              rules: [
                { required: true, message: '請輸入 活動類型' },
              ],
              initialValue: _.get(defaultValue, 'event_types'),
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

export default EventType;
