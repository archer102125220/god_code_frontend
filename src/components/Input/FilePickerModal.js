import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {
  Spin,
  Button,
  Modal,
  Upload,
  Icon,
} from 'antd';

class FilePickerModal extends React.Component {
  static propTypes = {
    buttonProps: PropTypes.object,
    buttonText: PropTypes.string,
    uploaderProps: PropTypes.object,
  }

  static defaultProps = {
    buttonProps: {
      icon: 'upload',
    },
    buttonText: '上傳',
    uploaderProps: {},
    uploadAction: (file) => {},
  }

  state = {
    visible: false,
    fileList: [],
    uploading: false,
  }

  resetState = () => {
    this.toggleModal(false);
    this.setState({
      fileList: [],
      uploading: false,
    })
  }

  // 切換Modal顯示
  toggleModal = (status) => {
    const { visible } = this.state;
    if (_.isUndefined(status)) {
      this.setState({
        visible: !visible,
      });
    } else {
      this.setState({
        visible: status,
      })
    }
  }

  handleButtonClick = (e) => {
    const { buttonProps } = this.props;
    if (_.has(buttonProps, 'onClick')) {
      const res = _.invoke(buttonProps, 'onClick', e);
      if (res === false) {
        return;
      }
    }
    this.toggleModal(true);
  }

  handleModalCancel = () => {
    this.resetState();
  }

  handleModalOk = async () => {
    const { uploadAction } = this.props;
    const { fileList } = this.state;
    this.setState({
      uploading: true,
    });
    const file = _.get(fileList, 0);
    await uploadAction(file)
    this.resetState();
  }

  handleUploaderRemove = (file) => {
    this.setState({
      fileList: [],
    });
  }

  handleUploaderBeforeUpload = (file) => {
    this.setState({
      fileList: [file],
    });
    return false;
  }

  renderUploader() {
    const { uploaderProps } = this.props;
    const { fileList, uploading } = this.state;
    return (
      <Spin spinning={uploading} tip="處理中">
        <Upload.Dragger
          onRemove={this.handleUploaderRemove}
          beforeUpload={this.handleUploaderBeforeUpload}
          fileList={fileList}
          {...uploaderProps}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">單擊或拖動文件到此區域進行上傳</p>
        </Upload.Dragger>
      </Spin>
    )
  }

  renderModal() {
    const { visible, fileList, uploading } = this.state;
    return (
      <Modal
        title="上傳檔案"
        visible={visible}
        closable={true && !uploading}
        maskClosable={true && !uploading}
        onCancel={this.handleModalCancel}
        onOk={this.handleModalOk}
        okText="上傳"
        okButtonProps={{
          disabled: fileList.length === 0,
          loading: uploading,
        }}
        cancelButtonProps={{
          disabled: uploading,
        }}
      >
        {this.renderUploader()}
      </Modal>
    );
  }

  render() {
    const { buttonProps, buttonText } = this.props;
    return (
      <React.Fragment>
        <Button {...buttonProps} onClick={this.handleButtonClick}>{buttonText}</Button>
        {this.renderModal()}
      </React.Fragment>
    );
  }
}

export default FilePickerModal;
