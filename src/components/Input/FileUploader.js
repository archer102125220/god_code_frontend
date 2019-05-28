import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import { Upload, Icon, List } from 'antd';

import request from '@/utils/request';

@connect(({ auth }) => ({ auth }))
class FileUploader extends React.Component {

  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    uploadPath: PropTypes.string.isRequired,
    readonly: PropTypes.bool,
    draggerProps: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    fieldName: 'file',
    uploadPath: request.url(''),
    draggerProps: {},
    readonly: false,
    onChange: () => { },
  }

  state = {
    fileList: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      fileList: _.map(_.get(nextProps, 'value.list', []), f => {
        if (_.has(f, 'response.id')) return f;
        if (_.has(f, 'id')) {
          return {
            uid: `fileuploader_file_${_.get(f, 'id')}`,
            url: _.get(f, 'url'),
            name: _.get(f, 'name'),
            status: 'done',
            response: f,
          }
        }
      }),
    };
  }

  handleDraggerChange = (info) => {
    const { onChange } = this.props;
    const { file, fileList } = info;
    const isUploading = _.chain(fileList)
      .map(f => _.get(f, 'status', null))
      .indexOf('uploading')
      .value();
    const normalizeFileList = _.map(fileList, f => {
      if (_.has(f, 'response.id')) {
        return _.extend(f, {
          uid: `fileuploader_file_${_.get(f, 'response.id')}`,
          url: _.get(f, 'response.url'),
          name: _.get(f, 'response.name'),
        });
      }
      return f;
    });
    this.setState({
      fileList: normalizeFileList
    });
    onChange({
      status: (isUploading !== -1 || _.get(file, 'status') === 'uploading') ? 'uploading' : 'done',
      list: normalizeFileList,
    })
  }

  getDraggerProps = () => {
    const { auth, fieldName, uploadPath, draggerProps } = this.props;
    const { fileList } = this.state;
    const token = _.get(auth, 'token', null);
    return _.extend({
      nams: fieldName,
      multiple: true,
      action: request.url(uploadPath),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onChange: this.handleDraggerChange,
      defaultFileList: fileList,
    }, draggerProps);
  }

  renderUploader() {
    return (
      <Upload.Dragger {...this.getDraggerProps()}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">單擊或拖動文件到此區域進行上傳</p>
        <p className="ant-upload-hint">支持單個或批量上傳</p>
      </Upload.Dragger>
    )
  }

  renderList() {
    const { fileList } = this.state;
    return (
      <List
        size="small"
        bordered={false}
        dataSource={fileList}
        renderItem={item => {
          if (_.isUndefined(item)) return <span />;
          const { url, name } = item;
          const linkComponent = _.isUndefined(url) ? name : (
            <a href={url}
              target="_blank"
              rel="noopener noreferrer">
              {name}
            </a>
          );
          return (
            <List.Item>
              <Icon type="paper-clip" />
              {linkComponent}
            </List.Item>
          );
        }}
      />
    );
  }

  render() {
    const { readonly } = this.props;
    if (readonly) {
      return this.renderList();
    }
    return this.renderUploader();
  }

}

export default FileUploader;
