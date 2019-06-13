import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
} from 'antd';

import FileUploader from '@/components/Input/FileUploader';
import ReadonlyText from '@/components/Input/ReadonlyText';
import QuerySelect from '@/components/Input/Query/QuerySelect';

@Form.create({
  onValuesChange: (props, changed, all) => {
    const { onValuesChange } = props;
    if (_.isFunction(onValuesChange)) {
      onValuesChange(true);
    }
  }
})
class EventAlbum extends React.Component {
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
        <Form.Item label="活動集錦" {...this.formItemLayout}>
          {
            getFieldDecorator('event_albums', {
              rules: [
                { required: true, message: '請輸入 活動類型' },
              ],
              initialValue: _.get(defaultValue, 'event_albums'),
            })(
              (isReadonly) ?
                <ReadonlyText />
                :
                <Input disabled={loading} />
            )
          }
        </Form.Item>
        <Form.Item label="活動類型" {...this.formItemLayout}>
          {
            getFieldDecorator('event_type_id', {
              rules: [
                { required: true, message: '請輸入 活動類型' },
              ],
              initialValue: _.get(defaultValue, 'event_type_id', null),
            })(
              <QuerySelect model="event_type" valueKey="id" displayKey="event_types" nullable={true} readonly={isReadonly} />
            )
          }
        </Form.Item>
        <Form.Item label="附加檔案" {...this.formItemLayout}>
          {
            getFieldDecorator('files', {
              rules: [{
                validator: (rule, value, callback, source, options) => {
                  const { status } = value;
                  switch(status) {
                    case 'done':
                      callback();
                      break;
                    case 'uploading':
                      callback(['files is uploading']);
                      break;
                    default:
                      callback([`unknow status ${status}`]);
                      break;
                  }
                },
                message: <div style={{paddingTop: 10}}>檔案正在上傳中</div>,
              }],
              initialValue: {
                status: 'done',
                list: _.get(defaultValue, 'files', []),
              },
            })(
              <FileUploader readonly={isReadonly} uploadPath="/event_album/upload" />
            )
          }
        </Form.Item>
      </Form>
    );
  }
}

export default EventAlbum;
