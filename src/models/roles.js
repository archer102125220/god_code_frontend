import _ from 'lodash';
import * as role from '@/services/role';

import Notification from '@/components/Notification';

export default {
  namespace: 'roles',
  state: [],
  reducers: {
    RESET_all(state) {
      return [];
    },
    SET_roles(state, { payload }) {
      return payload;
    },
    PUSH_role(state, { payload }) {
      return _.concat(state, payload);
    },
    UPDATE_role(state, { payload }) {
      const { id } = payload;
      if (_.isUndefined(id)) return state;
      const index = _.findIndex(state, ['id', _.toSafeInteger(id)]);
      if (index >= 0) _.set(state, index, payload);
      return state;
    },
    REMOVE_role(state, { payload }) {
      const { id } = payload;
      if (_.isUndefined(id)) return state;
      _.remove(state, v => _.isEqual(v.id, _.toSafeInteger(id)));
      return state;
    },
  },
  effects: {
    * GET_roles(action, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(role.GET_roles, token);
        yield put({
          type: 'roles/SET_roles',
          payload: data,
        });
      } catch (e) {

      }
    },
    * POST_role({ payload, callback }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const v = yield call(role.POST_role, payload, token);
        yield put({
          type: 'roles/PUSH_role',
          payload: v,
        });
        Notification.success({
          message: '新增完成',
          description: `已經新增 ${_.get(v, 'name', '')} 角色權限`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
    * PATCH_role({ payload, callback }, { put, call, select }) {
      try {
        const { id, data } = payload;
        const token = yield select(state => state.auth.token);
        const v = yield call(role.PATCH_role, id, data, token);
        yield put({
          type: 'roles/UPDATE_role',
          payload: v,
        });
        Notification.success({
          message: '編輯完成',
          description: `已經更新 ${_.get(v, 'name', '')} 角色權限`,
        });
        if (callback) callback();
      } catch (e) {

      }
    },
    * DELETE_role({ payload }, { put, call, select }) {
      try {
        const { id } = payload;
        const token = yield select(state => state.auth.token);
        yield call(role.DELETE_role, id, token);
        yield put({
          type: 'roles/REMOVE_role',
          payload: {
            id
          },
        });
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
