import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';

import AuthorizedMethods from '@/config/authorized';

const createAuthorizedHOC = (checkFunc, checkParams, FailComponent, PassComponent) => {
  const Authorized = class extends React.Component {
    render() {
      const isPass = checkFunc(this.props.state, checkParams);
      if (isPass) {
        if (_.isUndefined(PassComponent)) {
          return this.props.children;
        }
        if (React.isValidElement(PassComponent)) {
          return PassComponent;
        }
        return <PassComponent />;
      } else {
        if (_.isUndefined(FailComponent)) {
          return null;
        }
        if (React.isValidElement(FailComponent)) {
          return FailComponent;
        }
        return <FailComponent />;
      }
    }
  }
  return connect(state => ({ state }))(Authorized);
}

const createDecoratorHOC = (checkFunc, checkParams, config) => (Component) => {
  const fail = _.get(config, 'fail', null);
  return createAuthorizedHOC(checkFunc, checkParams, fail, Component);
}

const generateAuthorizedDecorator = (checkFunc) => {
  return (...params) => {
    return (target) => {
      switch (params.length) {
        case 0:
          return createDecoratorHOC(checkFunc)(target);
        case 1:
          const paramsIsConfig = _.get(params[0], 'noParams', false);
          if (paramsIsConfig) {
            return createDecoratorHOC(checkFunc, null, params[0])(target);
          }
          return createDecoratorHOC(checkFunc, params[0])(target);
        case 2:
          return createDecoratorHOC(checkFunc, params[0], params[1])(target);
        default:
          return null;
      }
    }
  }
}

const generateAuthorizedComponent = (checkFunc) => {
  const Authorized = class extends React.Component {
    static propTypes = {
      state: PropTypes.object.isRequired,
      params: PropTypes.any,
      fail: PropTypes.element,
    }

    static defaultProps = {
      fail: null,
    }

    render() {
      const { state, params, fail } = this.props;
      const isPass = checkFunc(state, params);
      if (isPass) {
        return this.props.children;
      } else {
        if (_.isUndefined(fail)) {
          return null;
        }
        if (React.isValidElement(fail)) {
          return fail;
        }
        return <fail />;
      }
    }
  }
  return connect(state => ({ state }))(Authorized);
}

const generateAuthorizedFunction = (checkFunc) => (params) => {
  const state = _.invoke(window, 'g_app._store.getState') || {};
  return checkFunc(state, params);
}

const AuthorizedDecorator = _.chain(AuthorizedMethods).mapValues(v => generateAuthorizedDecorator(v)).mapKeys((value, key) => {
  return _.lowerFirst(key);
}).value();
const AuthorizedHOC = _.chain(AuthorizedMethods).mapValues(v => generateAuthorizedComponent(v)).mapKeys((value, key) => {
  value.displayName = `Authorized.${_.upperFirst(key)}`;
  return _.upperFirst(key);
}).value();
const AuthorizedFunction = _.chain(AuthorizedMethods).mapValues(v => generateAuthorizedFunction(v)).mapKeys((value, key) => {
  return `\$${key}`;
}).value();

export default _.merge(AuthorizedDecorator, AuthorizedHOC, AuthorizedFunction);
