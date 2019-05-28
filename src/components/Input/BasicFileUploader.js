import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import { Upload, Icon, Button, List } from 'antd';

import request from '@/utils/request';

@connect(({ auth }) => ({ auth }))
class BasicFileUploader extends React.Component {

  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    uploadPath: PropTypes.string.isRequired,
    readonly: PropTypes.bool,
    uploaderProps: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    fieldName: 'file',
    uploadPath: request.url(''),
    uploaderProps: {},
    readonly: false,
    onChange: () => { },
  }

  state = {
    list: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps;
    const { list } = value;
    const file = _.get(list, 0, null);
    if(_.has(file, 'id')) {
      return {
        list: [{
          uid: `singlefileuploader_file_${_.get(file, 'id')}`,
          url: _.get(file, 'url'),
          name: _.get(file, 'name'),
          status: 'done',
          response: file,
        }],
      };
    }
    return null;
  }

  handleBeforeUpload = (file, fileList) => {
    const { onChange } = this.props;
    if(fileList.length >= 1) {
      this.setState({
        list: [],
      });
      onChange({
        status: 'done',
        list: [],
      });
    }
    return true;
  }

  handleUploaderChange = (info) => {
    const { onChange } = this.props;
    const { file } = info;
    let newFileState = file;
    if(_.has(file, 'response.id')) {
      newFileState = _.extend(file, {
        uid: `singlefileuploader_file_${_.get(file, 'response.id')}`,
        url: _.get(file, 'response.url'),
        name: _.get(file, 'response.name'),
      });
    }
    if(_.get(file, 'status') === 'removed'){
      newFileState = null;
    }
    this.setState({
      list: _.isNull(newFileState) ? [] : [newFileState],
    });
    onChange({
      status: (_.get(file, 'status') === 'uploading') ? 'uploading' : 'done',
      list: _.isNull(newFileState) ? [] : [newFileState],
    });
  }

  getUploaderProps = () => {
    const { auth, fieldName, uploadPath, uploaderProps } = this.props;
    const { list } = this.state;
    const token = _.get(auth, 'token', null);
    return _.extend({
      nams: fieldName,
      multiple: false,
      action: request.url(uploadPath),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      beforeUpload: this.handleBeforeUpload,
      onChange: this.handleUploaderChange,
      defaultFileList: list,
      fileList: list,
    }, uploaderProps);
  }

  renderUploader() {
    return (
      <Upload {...this.getUploaderProps()}>
        <Button>
          <Icon type="upload" /> 選擇檔案
        </Button>
      </Upload>
    )
  }

  renderList() {
    const { list } = this.state;
    return (
      <List
        size="small"
        bordered={false}
        dataSource={list}
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
    if(readonly) return this.renderList();
    return this.renderUploader();
  }

}

export default BasicFileUploader;
