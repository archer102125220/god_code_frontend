import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Redirect from 'umi/redirect';
import withRouter from 'umi/withRouter';

import AdminLayout from '@/layouts/AdminLayout';
import Authorized from '@/components/Authorized';

import AuthTokenValidate from '@/components/AuthTokenValidate';
import PersistGate from '@/components/PersistGate';

import { matchRoute } from '@/utils/router';

const failRedirectRoute = '/login';

@withRouter
class Layout extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  renderAuthorized(route) {
    const authorizedRoute = _.get(route, 'authorized', {});
    const { name, params, failRedirect } = authorizedRoute;
    const AuthorizedComponent = _.get(Authorized, _.upperFirst(name));
    if (_.isUndefined(name) || _.isUndefined(AuthorizedComponent)) return this.props.children;
    const failComponent = (
      <Redirect to={_.isUndefined(failRedirect) ? failRedirectRoute : failRedirect} />
    );
    return (
      <AuthorizedComponent params={params} fail={failComponent}>
        {this.props.children}
      </AuthorizedComponent>
    );
  }

  renderLayout() {
    const { pathname } = this.props.location;
    const route = matchRoute(pathname);
    const layout = _.get(route, 'layout', null);
    const content = this.renderAuthorized(route);
    switch (_.toLower(layout)) {
      case 'adminlayout':
        return <AdminLayout>{content}</AdminLayout>
      default:
        return content;
    }
  }

  render() {
    return (
      <PersistGate>
        <AuthTokenValidate>
          {this.renderLayout()}
        </AuthTokenValidate>
      </PersistGate>
    );
  }
}

export default Layout;
