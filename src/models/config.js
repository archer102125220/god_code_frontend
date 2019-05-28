import _ from 'lodash';
import * as config from '@/services/config';

import Notification from '@/components/Notification';
export default {
  namespace: 'config',
  state: {},
  reducers: {
    RESET_all(state) {
      return {};
    },
    SET_configs(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    * GET_configs(action, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(config.GET_configs, token);
        yield put({
          type: 'config/SET_configs',
          payload: data,
        });
      } catch (e) {

      }
    },
    * PATCH_configs({ payload,callback }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(config.PATCH_config, payload, token);
        yield put({
          type: 'config/SET_configs',
          payload: data,
        });
        Notification.success({
          message: '編輯完成',
          description: `已經更新系統配置`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
