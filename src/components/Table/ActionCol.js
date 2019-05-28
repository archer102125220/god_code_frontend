import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Popconfirm, Tooltip } from 'antd';

import styles from './ActionCol.css';

class ActionCol extends React.Component {
  static propTypes = {
    text: PropTypes.any.isRequired,
    record: PropTypes.any.isRequired,

    showDetail: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    onDetail: PropTypes.func,
    showEdit: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    onEdit: PropTypes.func,
    showDelete: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    onDelete: PropTypes.func,
    showStatus: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    onStatus: PropTypes.func,
    showDownload: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    onDownload: PropTypes.func,
  }
  static defaultProps = {
    text: null,
    record: null,
    showDetail: false,
    onDetail: () => { },
    showEdit: false,
    onEdit: () => { },
    showDelete: false,
    onDelete: () => { },
    showStatus: false,
    onStatus: () => { },
    showDownload: false,
    onDownload: () => { },
  }

  hasDataStatus() {
    const { record } = this.props;
    return _.has(record, 'deleted_at');
  }

  isDataEnabled() {
    const { record } = this.props;
    if (!this.hasDataStatus()) return true;
    return _.isNull(_.get(record, 'deleted_at'));
  }

  renderDetailButton() {
    const { record, showDetail, onDetail } = this.props;
    const enabled = this.isDataEnabled();
    const show = (_.isFunction(showDetail)) ? _.invoke(this.props, 'showDetail', record) : showDetail;
    const onClick = () => {
      if (_.isFunction(onDetail)) _.invoke(this.props, 'onDetail', record);
    }

    if (enabled && show) {
      return (
        <Tooltip placement="top" title="檢視" >
          <Button className={styles.actioncol_button} icon="ellipsis" onClick={onClick} />
        </Tooltip>
      )
    }
    return null;
  }

  renderEditButton() {
    const { record, showEdit, onEdit } = this.props;
    const enabled = this.isDataEnabled();
    const show = (_.isFunction(showEdit)) ? _.invoke(this.props, 'showEdit', record) : showEdit;
    const onClick = () => {
      if (_.isFunction(onEdit)) _.invoke(this.props, 'onEdit', record);
    }
    if (enabled && show) {
      return (
        <Tooltip placement="top" title="編輯">
          <Button className={styles.actioncol_button} icon="edit" onClick={onClick} />
        </Tooltip>
      )
    }
    return null;
  }

  renderDeleteButton() {
    const { record, showDelete, onDelete } = this.props;
    const enabled = this.isDataEnabled();
    const show = (_.isFunction(showDelete)) ? _.invoke(this.props, 'showDelete', record) : showDelete;
    const onClick = () => {
      if (_.isFunction(onDelete)) _.invoke(this.props, 'onDelete', record);
    }
    if (enabled && show) {
      return (
        <Popconfirm
          title={`確定刪除這筆資料？這個操作無法還原且相關資料會被刪除。`}
          placement="topRight"
          okText="確定"
          cancelText="取消"
          onConfirm={onClick}
        >
          <Tooltip placement="top" title="刪除">
            <Button className={styles.actioncol_button} type="danger" icon="delete" />
          </Tooltip>
        </Popconfirm>
      )
    }
    return null;
  }

  renderStatusButton() {
    const { record, showStatus, onStatus } = this.props;
    if (!this.hasDataStatus()) return null;
    const isEnabled = this.isDataEnabled();
    const show = (_.isFunction(showStatus)) ? _.invoke(this.props, 'showStatus', record) : showStatus;
    const onClick = () => {
      if (_.isFunction(onStatus)) _.invoke(this.props, 'onStatus', record, !isEnabled);
    }
    if (show) {
      return (
        <Tooltip placement="top" title={(isEnabled) ? '禁用' : '啟用'}>
          <Button className={styles.actioncol_button} type={(isEnabled) ? 'danger' : 'dashed'} icon={(isEnabled) ? 'stop' : 'check'} onClick={onClick} />
        </Tooltip>
      );
    }
    return null;
  }

  renderDownloadButton() {
    const { record, showDownload, onDownload } = this.props;
    const enabled = this.isDataEnabled();
    const show = (_.isFunction(showDownload)) ? _.invoke(this.props, 'showDownload', record) : showDownload;
    const onClick = () => {
      if (_.isFunction(onDownload)) _.invoke(this.props, 'onDownload', record);
    }

    if (enabled && show) {
      return (
        <Tooltip placement="top" title="下載">
          <Button className={styles.actioncol_button} icon="download" onClick={onClick} />
        </Tooltip>
      )
    }
    return null;
  }

  render() {
    return (
      <span>
        {this.renderDetailButton()}
        {this.renderEditButton()}
        {this.renderDeleteButton()}
        {this.renderStatusButton()}
        {this.renderDownloadButton()}
      </span>
    );
  }
}

export default ActionCol;
