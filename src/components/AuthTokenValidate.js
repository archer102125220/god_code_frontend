import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import moment from 'moment';
import JwtDecode from 'jwt-decode';

import Notification from '@/components/Notification';

@connect(({ auth }) => ({ auth }))
class AuthTokenValidate extends React.Component {
  state = {
    updateTimer: null,
  };

  /**
   * 取得Token
   *
   * @param Object fromProps 來源的props
   * @return Null|String Token
   */
  getToken(fromProps) {
    const props = (_.isUndefined(fromProps)) ? this.props : fromProps;
    return _.get(props, 'auth.token', null);
  }

  /**
   * 取得Token中的資訊
   *
   * @param String token
   * @return Object Token資訊
   */
  parseToken(token = null) {
    if (_.isNull(token)) return {};
    try {
      return JwtDecode(token);
    } catch (err) {
      return {};
    }
  }

  /**
   * 取得Tokene過期時間
   * @param String token
   * @return Null|Moment 過期時間
   */
  getTokenOutdateTime(token = null) {
    const jwtPayload = this.parseToken(token);
    const { exp } = jwtPayload;
    if (_.isUndefined(exp)) return null;
    return moment.unix(exp);
  }

  /**
   * 判斷Token是否過期
   * @param String token
   * @return Boolean
   */
  isTokenOutdate(token = null) {
    const exp_moment = this.getTokenOutdateTime(token);
    if (_.isNull(exp_moment)) return true;
    return moment().isAfter(exp_moment);
  }

  /**
   * 清除更新Timer
   */
  cleanUpdateTimer() {
    const { updateTimer } = this.state;
    if (_.isNull(updateTimer)) return;
    clearTimeout(updateTimer);
    this.setState({
      updateTimer: null,
    })
  }

  /**
   * 建立更新Timer
   * @param Int delay 當幾毫秒後觸發更新
   */
  createUpdateTimer = (delay) => {
    this.cleanUpdateTimer();
    this.setState({
      updateTimer: setTimeout(this.handleUpdateTimerTick, delay),
    });
  }

  /**
   * Timer觸發時進行Token刷新
   */
  handleUpdateTimerTick = () => {
    const { dispatch } = this.props;
    this.cleanUpdateTimer();
    dispatch({
      type: 'auth/GET_refresh',
    });
  }

  /**
   * 設定Timer，使有效的Token在過期之前進行刷新
   */
  setUpdateTimer = () => {
    const { updateTimer } = this.state;
    const token = this.getToken();
    // token 未過期，設定計時器自動更新
    const outdateAt = this.getTokenOutdateTime(token);
    if (_.isNull(updateTimer) && !_.isNull(outdateAt)) {
      // 設定Token需要多久之前被刷新
      const tickAt = outdateAt.subtract(10, 'minutes');
      const diff = tickAt.diff(moment());
      // 當超過限制時間時，會在1毫秒後觸發更新
      const delay = (diff >= 1) ? diff : 1;
      this.createUpdateTimer((delay >= 1) ? delay : 1);
    }
  };

  /**
   * 清除過期Token
   */
  cleanOutdateToken = () => {
    const { dispatch } = this.props;
    this.cleanUpdateTimer();
    dispatch({
      type: 'auth/SET_logout',
    });
    Notification.warning({
      message: '驗證已逾期',
      description: '請重新登入後繼續使用'
    })
  };

  /**
   * 取得並判斷Token狀況進行更新
   */
  tokenUpdate = (fromProps) => {
    const props = (_.isUndefined(fromProps)) ? this.props : fromProps;
    const { dispatch } = props;
    const token = this.getToken();
    if (_.isNull(token)) {
      // 無token
      return;
    }
    // 包含token
    if (this.isTokenOutdate(token)) {
      // token已經過期，需要清空並通知
      this.cleanOutdateToken();
    } else {
      // token尚未過期，檢查下次更新時間並定時
      this.setUpdateTimer();
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.tokenUpdate(nextProps);
  }

  componentDidMount(){
    this.tokenUpdate();
  }

  componentWillUnmount() {
    this.cleanUpdateTimer();
  }

  render() {
    return this.props.children;
  }
}

export default AuthTokenValidate;
