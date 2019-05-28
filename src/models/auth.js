import _ from 'lodash';
import * as auth from '@/services/auth';

import Notification from '@/components/Notification';

export default {
  namespace: 'auth',
  state: {
    token: null,
    user: null,
    roles: [],
    permissions: [],
  },
  reducers: {
    RESET_all(state) {
      return {
        token: null,
        user: null,
        roles: [],
        permissions: [],
      };
    },
    SET_auth(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    SET_user(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },
  },
  effects: {
    * POST_login({ payload, callback }, { put, call }) {
      try {
        const data = yield call(auth.POST_login,
          payload.username,
          payload.password,
        );

        yield put({
          type: 'auth/SET_auth',
          payload: data,
        });
        yield put({
          type: 'auth/GET_profile',
        });

        Notification.success({
          message: '登入成功',
          description: `歡迎回來，${_.get(payload, 'username', '')}`,
        });

        if (callback) callback();
      } catch (error) {
        if (error.isAxiosError) {
          switch (error.response.status) {
            case 403:
            case 404:
              Notification.error({
                message: '登入失敗',
                description: '無效的帳號或密碼，請再試一次!',
              });
              break;
            default:
              break;
          }
        }
        if (callback) callback(error);
      }
    },
    * SET_logout({ payload, callback }, { put, call, select }) {
      try {
        const resetModels = ['auth', 'roles'];
        yield resetModels.map((value) => put({
          type: `${value}/RESET_all`,
        }));

        if (callback) callback();
      } catch (error) {

      }
    },
    * GET_profile({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(auth.GET_profile, token);

        yield put({
          type: 'auth/SET_user',
          payload: data,
        });
      } catch (error) {

      }
    },
    * POST_profile({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(auth.POST_profile, payload, token);

        yield put({
          type: 'auth/SET_user',
          payload: data,
        });
      } catch (error) {

      }
    },
    * GET_refresh({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(auth.GET_refresh, token);

        yield put({
          type: 'auth/SET_auth',
          payload: data,
        });

      } catch (error) {

      }
    },
    * POST_resetPassword({ payload, callback }, { call }) {
      try {
        const { username, email } = payload;
        yield call(auth.POST_resetPassword, username, email);

        Notification.info({
          message: '重設成功',
          description: `我們已經寄出密碼重設信件，請登入您註冊的信箱進行後續的步驟`,
        });
        if (_.isFunction(callback)) callback();
      } catch (error) {

      }
    },
    * PATCH_resetPassword({ payload, callback }, { call }) {
      try {
        const { password, password_confirmation, token } = payload;
        yield call(auth.PATCH_resetPassword, password, password_confirmation, token);

        Notification.info({
          message: '重設成功',
          description: `我們已經重新設定您的密碼`,
        });
        if (_.isFunction(callback)) callback();
      } catch (error) {

      }
    }
  },
  subscriptions: {
  },
};
