/**
 * layout: AdminLayout
 * breadcrumb: 首頁
 * authorized:
 *   name: isLogin
 */

import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import {
  Row,
  Col,
  Card,
  Spin,
  Drawer,
  Divider,
} from 'antd';
import { Charts } from 'ant-design-pro';
import Authorized from '@/components/Authorized';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';

import FileUploader from '@/components/Input/FileUploader';

const NEWS_STATUS_NORMAL = 0;
const NEWS_STATUS_TOP = 1;

@connect(state => ({
  home: _.get(state, 'home', {}),
  loading: _.get(state, 'loading.effects.home/GET_newsies', true) || _.get(state, 'loading.effects.home/GET_statisticses', true),
}))
class Index extends React.Component {
  newsTableColumns = [
    {
      title: '類型',
      dataIndex: 'status',
      ...Table.Filter.generateListFilter([
        { text: '一般', value: NEWS_STATUS_NORMAL },
        { text: '置頂', value: NEWS_STATUS_TOP },
      ], Table.Filter.wrapRecord(Table.Filter.sameValue, 'status')),
      render: (text, record) => {
        return _.get(['一般', '置頂'], text, '');
      }
    },
    {
      title: '公告開始日期',
      dataIndex: 'start_at',
      sorter: Table.Sorter.wrapValue(Table.Sorter.byText, 'start_at'),
      ...Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'start_at')),
    },
    {
      title: '公告主題',
      dataIndex: 'title',
      sorter: Table.Sorter.wrapValue(Table.Sorter.byText, 'title'),
      ...Table.Filter.generateInputFilter(Table.Filter.wrapRecord(Table.Filter.likeText, 'title')),
    },
    Table.Render.generateActionCol({
      showDetail: true,
      onDetail: (record) => {
        this.setState({
          newsDetailVisible: true,
          newsDetailData: record,
        });
      },
    }),
  ];

  state = {
    newsDetailVisible: false,
    newsDetailData: {},
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'home/GET_statisticses',
    });
    this.props.dispatch({
      type: 'home/GET_newsies',
    });
    window.dispatchEvent(new Event('resize')); // Fix Pie size error
  }

  getRepairStatisticses = () => {
    const { home } = this.props;
    const total = _.extend({
      prepare:0,
      send :0,
      accept :0,
      confirm:0,
      complete:0,
    }, _.get(home, 'statistics.repair', {}));
    const { prepare, send, accept, confirm, complete } = total;
    return [
      {
        x: '準備中',
        y: prepare,
      },
      {
        x: '已通知',
        y: send,
      },
      {
        x: '已接受',
        y: accept,
      },
      {
        x: '待驗收',
        y: confirm,
      },
      {
        x: '完工',
        y: complete,
      },
    ]
  }

  getDataStatisticses = () => {
    const { home } = this.props;
    const total = _.extend({
      route: 0,
      stop: 0,
      station: 0,
    }, _.get(home, 'statistics.total', {}));
    return total;
  }

  handleNewsDetailOnClose = () => {
    this.setState({
      newsDetailVisible: false,
    });
  }

  renderNewsDetailDrawer = () => {
    const { newsDetailVisible, newsDetailData } = this.state;
    const { title, content, files } = newsDetailData;
    return (
      <Drawer
        title={title}
        placement="right"
        onClose={this.handleNewsDetailOnClose}
        visible={newsDetailVisible}
        width={800}
      >
        <div dangerouslySetInnerHTML={{__html:content}} style={{margin: 10}} />
        <Divider orientation="left">附加檔案</Divider>
        <FileUploader readonly={true} value={{list: files, status: 'done'}} />
      </Drawer>
    )
  }

  render() {
    const { loading, home } = this.props;
    const news = _.get(home, 'newsies', []);
    const repairStatic = this.getRepairStatisticses();
    const dataStatic = this.getDataStatisticses();
    return (
      <div>
        <PageHeader />
        {Authorized.$hasPermission('indexchart.index') &&<Row gutter={12} style={{ margin: 20 }}>
          <Col span={10}>
            <Charts.ChartCard
              title="總站牌數量"
              total={() => (
                <span>
                  {_.get(dataStatic, 'stop', '-')}
                </span>
              )}
            />
            <Charts.ChartCard
              title="總站點數量"
              total={() => (
                <span>
                  {_.get(dataStatic, 'station', '-')}
                </span>
              )}
              style={{marginTop: 20}}
            />
            <Charts.ChartCard
              title="總路線數量"
              total={() => (
                <span>
                  {_.get(dataStatic, 'route', '-')}
                </span>
              )}
              style={{marginTop: 20}}
            />
          </Col>
          <Col span={14}>
            <Card title="維運資訊">
              <Spin spinning={loading}>
                <Charts.Pie hasLegend
                  title="報修單量"
                  subTitle="報修單量"
                  total={() => (
                    <span>
                      {repairStatic.reduce((pre, now) => now.y + pre, 0)}
                    </span>
                  )}
                  data={repairStatic}
                  valueFormat={val => <span>{val}</span>}
                  height={245}
                />
              </Spin>
            </Card>
          </Col>
        </Row>}
        {Authorized.$hasPermission('indexnews.index') &&<Card title="公告" style={{ margin: 20 }}>
          <Table columns={this.newsTableColumns} dataSource={news} loading={loading} />
        </Card>}
        {this.renderNewsDetailDrawer()}
      </div>
    );
  }
}

export default Index;
