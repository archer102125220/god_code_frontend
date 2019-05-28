import _ from 'lodash';
import * as user from '@/services/user';

import Notification from '@/components/Notification';

export default {
  namespace: 'users',
  state: [],
  reducers: {
    RESET_all(state) {
      return [];
    },
    SET_users(state, { payload }) {
      return payload;
    },
    PUSH_user(state, { payload }) {
      return _.concat(state, payload);
    },
    UPDATE_user(state, { payload }) {
      const { id } = payload;
      if (_.isUndefined(id)) return state;
      const index = _.findIndex(state, ['id', _.toSafeInteger(id)]);
      if (index >= 0) _.set(state, index, payload);
      return state;
    },
    REMOVE_user(state, { payload }) {
      const { id } = payload;
      if (_.isUndefined(id)) return state;
      _.remove(state, v => _.isEqual(v.id, _.toSafeInteger(id)));
      return state;
    },
  },
  effects: {
    * GET_users(action, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(user.GET_users, token);
        yield put({
          type: 'users/SET_users',
          payload: data,
        });
      } catch (e) {

      }
    },
    * POST_user({ payload, callback }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const v = yield call(user.POST_user, payload, token);
        yield put({
          type: 'users/PUSH_user',
          payload: v,
        });
        Notification.success({
          message: '新增完成',
          description: `已經新增 ${_.get(v, 'username', '')} 用戶`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
    * PATCH_user({ payload, callback }, { put, call, select }) {
      try {
        const { id, data } = payload;
        const token = yield select(state => state.auth.token);
        const v = yield call(user.PATCH_user, id, data, token);
        yield put({
          type: 'users/UPDATE_user',
          payload: v,
        });
        Notification.success({
          message: '編輯完成',
          description: `已經更新 ${_.get(v, 'username', '')} 用戶`,
        });
        if (callback) callback();
      } catch (error) {
        if (error.isAxiosError) {
          Notification.error({
            message: '編輯失敗',
            description: '使用者無編輯該用戶的權限',
          });
        }
        if (callback) callback(error);
      }
    },
    * DELETE_user({ payload }, { put, call, select }) {
      try {
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        yield call(user.DELETE_user, id, token);
        yield put({
          type: 'users/REMOVE_user',
          payload: {
            id
          },
        });
      } catch (e) {

      }
    },
    * CHANGESTATUS_user({ payload }, { put, call, select }) {
      try {
        const { id, status } = payload;
        const token = yield select(state => state.auth.token);
        const apiEndPoint = (status) ? user.RESTOREPATCH_user : user.SOFTDELETE_user;
        const v = yield call(apiEndPoint, id, token);
        yield put({
          type: 'users/UPDATE_user',
          payload: v,
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
