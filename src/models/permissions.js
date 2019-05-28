import _ from 'lodash';
import * as permission from '@/services/permission';

export default {
  namespace: 'permissions',
  state: [],
  reducers: {
    RESET_all(state) {
      return [];
    },
    SET_permissions(state, { payload }) {
      return payload;
    },
  },
  effects: {
    * GET_permissions(action, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(permission.GET_permissions, token);
        yield put({
          type: 'permissions/SET_permissions',
          payload: data,
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
