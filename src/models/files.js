import * as file from '@/services/file';

export default {
  namespace: 'files',
  state: {
    list: {},
    listQuery: {},
    detail: {},
  },
  reducers: {
    RESET_all(state) {
      return {};
    },
    SET_files(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    * GET_files({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        const data = yield call(file.GET_files, token, payload);
        yield put({
          type: 'files/SET_files',
          payload: {
            list: data,
            listQuery: payload,
          }
        });
      } catch (e) {

      }
    },
    * Download_file({ payload }, { put, call, select }) {
      try {
        const token = yield select(state => state.auth.token);
        yield call(file.DOWNLOAD_file, payload, token);
      } catch (e) {

      }
    },
  },
  subscriptions: {
  },
};
