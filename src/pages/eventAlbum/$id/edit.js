/**
 * title: 編輯活動集錦
 * breadcrumb: 編輯
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventAlbum.edit
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Prompt } from 'react-router'

import { Button, Card, Spin } from 'antd';

import PageLoading from '@/components/PageLoading';
import PageHeader from '@/components/PageHeader';
import PageFooter from '@/components/PageFooter';
import EventAlbumForm from '@/components/Form/EventAlbum';

@withRouter
@connect(state => ({
  eventAlbum: _.get(state, 'eventAlbums.detail', null),
  loading: _.get(state, 'loading.effects.eventAlbums/GET_eventAlbum', false) || _.get(state, 'loading.effects.eventAlbums/PATCH_eventAlbum', false),
}))
class EventAlbumEdit extends React.Component {
  state = {
    isFormChange: false,
  }

  getEventAlbumId = () => {
    const { match } = this.props;
    return _.toInteger(_.get(match, 'params.id', -1));
  }

  getEventAlbum = () => {
    const id = this.getEventAlbumId();
    this.props.dispatch({
      type: 'eventAlbums/GET_eventAlbum',
      payload: {
        id,
      },
    });
  }

  handleFormSubmit = () => {
    if (!_.has(this, 'eventAlbumForm.validateFields')) return null;
    const { eventAlbum } = this.props;
    if (_.isNull(eventAlbum)) return null;
    this.eventAlbumForm.validateFields((err, values) => {
      if (err) return err;
      const payload = _.omit(values, ['files']);
      const files = _.reduce(_.get(values, 'files.list', []), (res, f) => {
        if (_.has(f, 'id')) {
          res.push(_.get(f, 'id'));
        }
        if (_.has(f, 'response.id')) {
          res.push(_.get(f, 'response.id'));
        }
        return res;
      }, []);
      _.set(payload, 'files', files);
      this.props.dispatch({
        type: 'eventAlbums/PATCH_eventAlbum',
        payload: {
          id: _.get(eventAlbum, 'id'),
          data: payload,
        },
        callback: () => router.push('/eventAlbum'),
      });
    });
  }

  componentDidMount() {
    this.getEventAlbum();
  }

  handleFormChange = (isChange) => {
    if (isChange) {
      this.setState({
        isFormChange: true
      })
    }
  }

  render() {
    const { eventAlbum, loading } = this.props;
    const { isFormChange } = this.state;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.go(-1)}>取消</Button>
        <Button type="primary" icon="save" onClick={this.handleFormSubmit} loading={loading}>儲存</Button>
      </div>
    );
    return (
      <PageLoading isLoading={_.isNull(eventAlbum)}>
        <Prompt when={isFormChange && !loading} message="尚未儲存，確定要離開嗎？" />
        <PageHeader action={action} />
        <Spin tip="處理中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <EventAlbumForm ref={(f) => { this.eventAlbumForm = f; }} isEdit={true} defaultValue={eventAlbum} onValuesChange={this.handleFormChange} />
          </Card>
        </Spin>
        <PageFooter action={action} />
      </PageLoading>
    );
  }
}

export default EventAlbumEdit;
