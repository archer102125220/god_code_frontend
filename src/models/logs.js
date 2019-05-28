import _ from 'lodash';
import * as log from '@/services/log';

export default {
  namespace: 'logs',
  state: {
    list: {},
    listQuery: {},
    detail: {},
  },
  reducers: {
    RESET_all(state) {
      return {};
    },
    SET_logs(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    SET_detail(state, { payload }) {
      return {
        ...state,
        detail: payload
      }
    },
  },
  effects: {
    * GET_logs({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(log.GET_logs, token, payload);
        yield put({
          type: 'logs/SET_logs',
          payload: {
            list: data,
            listQuery: payload,
          }
        });
      } catch (e) {

      }
    },
    * GET_log({ payload }, { put, call, select }) {
      try {
        yield put({
          type: 'logs/SET_detail',
          payload: null,
        });
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        const data = yield call(log.GET_log, id, token);
        yield put({
          type: 'logs/SET_detail',
          payload: data,
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
