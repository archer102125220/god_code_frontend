import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

class ReadonlyText extends React.Component {
  static propTypes = {
    valuePropName: PropTypes.string,
    converter: PropTypes.func,
  };

  static defaultProps = {
    valuePropName: 'value',
    converter: value => value,
  }

  state = {
    value: null,
  }

  constructor(props, context) {
    super(props, context);
    const { valuePropName } = props;
    const value = _.get(props, valuePropName);
    this.state = {
      value,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { valuePropName } = nextProps;
    if (valuePropName in nextProps) {
      const value = _.get(nextProps, valuePropName);
      this.setState({
        value
      });
    }
  }

  render() {
    const { converter, valuePropName } = this.props;
    const { value } = this.state;

    return <div {..._.omit(this.props, ['valuePropName', [valuePropName], 'converter'])}>{converter(value)}</div>;
  }
}

export default ReadonlyText;
