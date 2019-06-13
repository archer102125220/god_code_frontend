import _ from 'lodash';
import * as eventType from '@/services/eventType';

import Notification from '@/components/Notification';
export default {
  namespace: 'eventTypes',
  state: {
    list: {},
    listQuery: {},
    detail: null,
  },
  reducers: {
    RESET_all(state) {
      return {
        list: {},
        listQuery: {},
        detail: null,
      };
    },
    SET_eventTypes(state, { payload }) {
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
    UPDATE_eventType(state, { payload }) {
      const { id } = payload;
      if (_.isUndefined(id)) return state;
      const data = _.get(state, 'list.data', []);
      const index = _.findIndex(data, ['id', _.toSafeInteger(id)]);
      if (index >= 0) _.set(state, `list.data.${index}`, payload);
      return state;
    },
  },
  effects: {
    * GET_eventTypes({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(eventType.GET_eventTypes, token, payload);
        yield put({
          type: 'eventTypes/SET_eventTypes',
          payload: {
            list: data,
            listQuery: payload,
          }
        });
      } catch (e) {

      }
    },
    * GET_eventType({ payload }, { put, call, select }) {
      try {
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        const data = yield call(eventType.GET_eventType, id, token);
        yield put({
          type: 'eventTypes/SET_detail',
          payload: data,
        });
      } catch (e) {

      }
    },
    * POST_eventType({ payload, callback }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const v = yield call(eventType.POST_eventType, payload, token);
        Notification.success({
          message: '新增完成',
          description: `已經新增 ${_.get(v, 'title', '')} 文章`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
    * PATCH_eventType({ payload, callback }, { put, call, select }) {
      try {
        const { id, data } = payload;
        const token = yield select(state => state.auth.token);
        const v = yield call(eventType.PATCH_eventType, id, data, token);
        yield put({
          type: 'eventTypes/SET_detail',
          payload: v,
        });
        Notification.success({
          message: '編輯完成',
          description: `已經更新 ${_.get(v, 'title', '')} 文章`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
    * DELETE_eventType({ payload }, { put, call, select }) {
      try {
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        yield call(eventType.DELETE_eventType, id, token);
        const listQuery = yield select(state => state.eventTypes.listQuery);
        yield put({
          type: 'eventTypes/GET_eventTypes',
          payload: listQuery,
        });
      } catch (e) {

      }
    },
    * CHANGESTATUS_eventType({ payload }, { put, call, select }) {
      try {
        const { id, status } = payload;
        const token = yield select(state => state.auth.token);
        const apiEndPoint = (status) ? eventType.RESTOREPATCH_eventType : eventType.SOFTDELETE_eventType;
        const v = yield call(apiEndPoint, id, token);
        yield put({
          type: 'eventTypes/UPDATE_eventType',
          payload: v,
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (!_.startsWith(pathname, '/eventType')) {
          dispatch({
            type: 'eventTypes/RESET_all',
          });
        }
      });
    },
  },
};
