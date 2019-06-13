/**
 * title: 詳細資料
 * breadcrumb: 詳細
 * layout: AdminLayout
 * authorized:
 *   name: hasPermission
 *   params: eventAlbum.index
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';

import { Button, Card, Spin } from 'antd';
import { DescriptionList } from 'ant-design-pro';

import PageLoading from '@/components/PageLoading';
import PageHeader from '@/components/PageHeader';
import EventAlbumForm from '@/components/Form/EventAlbum';

@withRouter
@connect(state => ({
  eventAlbum: _.get(state, 'eventAlbums.detail', null),
  loading: _.get(state, 'loading.effects.eventAlbums/GET_eventAlbum', false),
}))
class EventAlbumDetail extends React.Component {
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

  componentDidMount() {
    this.getEventAlbum();
  }

  render() {
    const { eventAlbum, loading } = this.props;
    const action = (
      <div>
        <Button icon="close" onClick={() => router.go(-1)}>返回</Button>
      </div>
    );
    return (
      <PageLoading isLoading={_.isNull(eventAlbum)}>
        <PageHeader action={action} />
        <Spin tip="載入中" spinning={loading}>
          <Card style={{ margin: 20 }}>
            <EventAlbumForm isReadonly={true} defaultValue={eventAlbum} />
          </Card>
        </Spin>
      </PageLoading>
    );
  }
}

export default EventAlbumDetail;
