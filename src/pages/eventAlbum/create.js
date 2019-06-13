/**
 * title: 建立活動集錦
 * breadcrumb: 建立
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventAlbum.create
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';

import EventAlbumForm from '@/components/Form/EventAlbum';

@connect(state => ({
  loading: _.get(state, 'loading.effects.eventAlbums/POST_eventAlbum', false),
}))
class EventAlbumCreate extends React.Component {
  state = {
    isFormChange: false,
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'eventAlbumForm.validateFields')) return null;
    this.eventAlbumForm.validateFields((err, values) => {
      if (err) return err;
      const payload = _.omit(values, ['files']);
      const files = _.reduce(_.get(values, 'files.list', []), (res, f) => {
        if(_.has(f, 'response.id')){
          res.push(_.get(f, 'response.id'));
        }
        return res;
      }, []);
      _.set(payload, 'files', files);
      this.props.dispatch({
        type: 'eventAlbums/POST_eventAlbum',
        payload,
        callback: () => router.push('/eventAlbum'),
      });
    });
  }

  handleFormChange = (isChange) => {
    if (isChange) {
      this.setState({
        isFormChange: true
      })
    }
  }

  render() {
    const { loading } = this.props;
    const { isFormChange } = this.state;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.push('/eventAlbum')}>取消</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <div>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} />
        <Spin tip="儲存中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <EventAlbumForm ref={(f) => { this.eventAlbumForm = f; }} isCreate={true} onValuesChange={this.handleFormChange} />
          </Card>
        </Spin>
        <PageFooter action={action} />
      </div>
    );
  }
}

export default EventAlbumCreate;
