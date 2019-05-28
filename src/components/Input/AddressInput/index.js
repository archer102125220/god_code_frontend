import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Cascader, Input } from 'antd';

import AddressData from './data';

class AddressInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => { },
  }

  state = {
    cascader: [],
    input: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps;
    return AddressInput.getValueStateByString(value);
  }

  static getValueStateByString(address){
    if(_.isNull(address) || _.isUndefined(address)){
      return {
        cascader: [],
        input: '',
      };
    }
    const cascader = AddressInput.extractCascaderFromString(address);
    return {
      cascader,
      input: _.replace(address, cascader.join(''), ''),
    };
  }

  static extractCascaderFromString(address, data = AddressData){
    return _.reduce(data, (res, obj) => {
      const temp_label = _.get(obj, 'label');
      if(address.indexOf(temp_label) >= 0){
        res.push(temp_label);
        const temp_address = _.replace(address, temp_label, '');
        if(_.has(obj, 'children')){
          return _.concat(res, AddressInput.extractCascaderFromString(temp_address, obj.children));
        }
      }
      return res;
    }, []);
  }


  handleCascaderChange = (value, selectedOptions) => {
    this.handleOnChange({
      cascader: value,
    });
  }

  handleInputChange = (e) => {
    this.handleOnChange({
      input: e.target.value,
    });
  }

  handleOnChange = (updateContent) => {
    const payload = _.extend(this.state, updateContent);
    const { cascader, input } = payload;
    const { onChange } = this.props;
    const value = `${cascader.join('')}${input}`;
    onChange(value);
  }

  renderCascader() {
    const { cascader } = this.state;
    return <Cascader style={{ width: '30%' }} options={AddressData} onChange={this.handleCascaderChange} placeholder="請選擇縣市" defaultValue={cascader} value={cascader} />
  }

  renderInput(){
    const { input } = this.state;
    return <Input style={{ width: '70%' }} onChange={this.handleInputChange} defaultValue={input} />
  }

  render() {
    return (
      <Input.Group compact>
        {this.renderCascader()}
        {this.renderInput()}
      </Input.Group>
    );
  }
}

export default AddressInput;
