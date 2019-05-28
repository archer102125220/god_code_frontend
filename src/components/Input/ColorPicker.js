import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
} from 'antd';
import { BlockPicker } from 'react-color';

import styles from './ColorPicker.css';

class ColorPicker extends React.Component {
  static propTypes = {
    readonly: PropTypes.bool,

    onChange: PropTypes.func,
  }

  static defaultProps = {
    readonly: false,

    onChange: () => {}
  }

  state = {
    visible: false,
  }

  togglePicker(v){
    const { visible } = this.state;
    const newVisible = (_.isUndefined(v))?!visible: v;
    this.setState({
      visible: newVisible,
    })
  }

  handleButtonClick = (e) => {
    const { readonly } = this.props;
    if(!readonly) {
      this.togglePicker();
    }
  }

  handlePickerChange = (color, event) => {
    const { onChange } = this.props;
    onChange(color.hex);
  }

  renderPicker() {
    const { value } = this.props;
    const props = _.omit(this.props, ['value', 'onChange']);
    return (
      <div className={styles.popover}>
        <div className={styles.cover} onClick={ this.handleButtonClick }/>
        <BlockPicker {...props} color={value} onChangeComplete={this.handlePickerChange} triangle="hide" />
      </div>
    );
  }

  render(){
    const { value, readonly } = this.props;
    const { visible } = this.state;
    return (
      <React.Fragment>
        <Button onClick={this.handleButtonClick} style={{ backgroundColor:value, border: '1px solid #ccc' }} disabled={readonly}>{value}</Button>
        { visible && !readonly && this.renderPicker() }
      </React.Fragment>
    );
  }
}

export default ColorPicker;
