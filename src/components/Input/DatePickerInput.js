import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from 'antd';

import moment from 'moment';

class DatePickerInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => { },
  }

  handleDateChange = (date, dateFormat) => {
    const dateMoment =(_.isNull(date))? moment(moment(), dateFormat) : (moment.isMoment(date)) ? date : moment(date, dateFormat);
    const value = moment(dateMoment).format(dateFormat);
    _.invoke(this.props, 'onChange', value);
  }

  render() {
    const extendProps = _.omit(this.props, ['value', 'onChange', 'defaultValue']);
    const { value } = this.props;
    const dateFormat = _.get(this.props, 'format', 'YYYY-MM-DD');
    let dateValue;
    if (_.isUndefined(value)) {
      dateValue = '';
    }else {
      dateValue = moment(value, dateFormat);
    }
    return (
      <DatePicker defaultValue={dateValue} value={dateValue} onChange={this.handleDateChange} {...extendProps} />
    );
  }

}

export default DatePickerInput;
