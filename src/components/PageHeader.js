import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Link from 'umi/link';

import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import { PageHeader as AntdProPageHeader } from 'ant-design-pro';

import { matchRoute, flatRoutes } from '@/utils/router';

import './PageHeader.css';

const getBreadcrumbsRoutes = () => {
  const hasBreadcrumbsRoutes = flatRoutes(({ path, breadcrumb }) => (!_.isUndefined(path) && !_.isUndefined(breadcrumb)));
  return _.map(hasBreadcrumbsRoutes, (route) => {
    return _.pick(route, ['path', 'breadcrumb']);
  });
}

@withBreadcrumbs(getBreadcrumbsRoutes())
class PageHeader extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  antdProHeaderProps = ['title', 'logo', 'action', 'home', 'content', 'extraContent', 'tabList', 'tabActiveKey', 'tabDefaultActiveKey', 'wide', 'onTabChange'];

  getBreadcrumbList() {
    const { breadcrumbs } = this.props;
    return breadcrumbs.map((breadcrumb, index) => {
      const title = _.get(breadcrumb, 'props.children');
      const href = _.get(breadcrumb, 'props.match.url');
      return (breadcrumbs.length - 1 === index) ? { title } : { title, href };
    });
  }

  getPageTitle() {
    const { pathname } = this.props.location;
    const route = matchRoute(pathname);
    return _.get(route, 'title', null);
  }

  render() {
    const extendsProps = _.extend({
      title: this.getPageTitle(),
    }, _.pick(this.props, this.antdProHeaderProps));
    return <AntdProPageHeader breadcrumbList={this.getBreadcrumbList()} linkElement={Link} {...extendsProps} />
  }
}

export default PageHeader;
