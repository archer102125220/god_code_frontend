import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
} from 'antd';

class GPSMapButton extends React.Component {
  static propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }

  static defaultProps = {
    latitude: 0,
    longitude: 0,
  }

  handleButtonClick = () => {
    const { latitude, longitude } = this.props;
    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapUrl);
  }

  render() {
    const props = _.omit(this.props, ['latitude', 'longitude']);
    return (
      <Button icon="environment" {...props} onClick={this.handleButtonClick}/>
    )
  }

}

export default GPSMapButton;
