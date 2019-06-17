import _ from 'lodash';
import * as eventAlbum from '@/services/eventAlbum';

import Notification from '@/components/Notification';
export default {
  namespace: 'eventAlbums',
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
    SET_eventAlbums(state, { payload }) {
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
    UPDATE_eventAlbum(state, { payload }) {
      const { id } = payload;
      if (_.isUndefined(id)) return state;
      const data = _.get(state, 'list.data', []);
      const index = _.findIndex(data, ['id', _.toSafeInteger(id)]);
      if (index >= 0) _.set(state, `list.data.${index}`, payload);
      return state;
    },
  },
  effects: {
    * GET_eventAlbums({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(eventAlbum.GET_eventAlbums, token, payload);
        yield put({
          type: 'eventAlbums/SET_eventAlbums',
          payload: {
            list: data,
            listQuery: payload,
          }
        });
      } catch (e) {

      }
    },
    * GET_eventAlbum({ payload }, { put, call, select }) {
      try {
        yield put({
          type: 'eventAlbums/SET_detail',
          payload: null,
        });
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        const data = yield call(eventAlbum.GET_eventAlbum, id, token);
        yield put({
          type: 'eventAlbums/SET_detail',
          payload: data,
        });
      } catch (e) {

      }
    },
    * POST_eventAlbum({ payload, callback }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const v = yield call(eventAlbum.POST_eventAlbum, payload, token);
        Notification.success({
          message: '新增完成',
          description: `已經新增 ${_.get(v, 'title', '')} 文章`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
    * PATCH_eventAlbum({ payload, callback }, { put, call, select }) {
      try {
        const { id, data } = payload;
        const token = yield select(state => state.auth.token);
        const v = yield call(eventAlbum.PATCH_eventAlbum, id, data, token);
        yield put({
          type: 'eventAlbums/SET_detail',
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
    * DELETE_eventAlbum({ payload }, { put, call, select }) {
      try {
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        yield call(eventAlbum.DELETE_eventAlbum, id, token);
        const listQuery = yield select(state => state.eventAlbums.listQuery);
        yield put({
          type: 'eventAlbums/GET_eventAlbums',
          payload: listQuery,
        });
      } catch (e) {

      }
    },
    * CHANGESTATUS_eventAlbum({ payload }, { put, call, select }) {
      try {
        const { id, status } = payload;
        const token = yield select(state => state.auth.token);
        const apiEndPoint = (status) ? eventAlbum.RESTOREPATCH_eventAlbum : eventAlbum.SOFTDELETE_eventAlbum;
        const v = yield call(apiEndPoint, id, token);
        yield put({
          type: 'eventAlbums/UPDATE_eventAlbum',
          payload: v,
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (!_.startsWith(pathname, '/eventAlbum')) {
          dispatch({
            type: 'eventAlbums/RESET_all',
          });
        }
      });
    },
  },
};
