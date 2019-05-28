import React from 'react';
import PropTypes from 'prop-types';

import { Card, Spin } from 'antd';

import PageHeader from '@/components/PageHeader';

class PageLoading extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    isLoading: false
  }

  renderLoading() {
    return (
      <div>
        <PageHeader />
        <Spin tip="載入中" spinning={true}>
          <Card style={{ margin: 20, padding: '30px 50px' }} />
        </Spin>
      </div>
    );
  }

  render(){
    const { isLoading } = this.props;
    return (isLoading) ? this.renderLoading() : this.props.children;
  }
}

export default PageLoading;
