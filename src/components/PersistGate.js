import _ from 'lodash';
import React from 'react';
import withRouter from 'umi/withRouter';

import { PersistGate as ReduxPersistGate } from 'redux-persist/lib/integration/react';

import { Spin } from 'antd';

@withRouter
class PersistGate extends React.Component {

  loadingComponent = (
    <Spin size="large" />
  )

  getPersistor = () => {
    const store = _.get(window, 'g_app._store.persist');
    return store;
  }

  render() {
    return (
      <ReduxPersistGate persistor={this.getPersistor()}　loading={this.loadingComponent}>
        {this.props.children}
      </ReduxPersistGate>
    )
  }
}

export default PersistGate;
