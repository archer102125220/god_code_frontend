import _ from 'lodash';
import * as home from '@/services/home';

export default {
  namespace: 'home',
  state: {
    newsies: [],
    statistics: {},
  },
  reducers: {
    RESET_all(state) {
      return [];
    },
    SET_newsies(state, { payload }) {
      return {
        ...state,
        newsies: payload,
      }
    },
    SET_statisticses(state, { payload }) {
      return {
        ...state,
        statistics: payload,
      }
    },
  },
  effects: {
    * GET_newsies(action, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(home.GET_newsies, token);
        yield put({
          type: 'home/SET_newsies',
          payload: data,
        });
      } catch (e) {

      }
    },
    * GET_statisticses(action, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(home.GET_statistics, token);
        yield put({
          type: 'home/SET_statisticses',
          payload: data,
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
