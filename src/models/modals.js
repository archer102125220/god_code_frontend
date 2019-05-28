import _ from 'lodash';

import ProfileModal from '@/components/Modals/Profile';

export default {
  namespace: 'modals',
  state: {
    [ProfileModal.NAME]: {
      visible: false,
      props: undefined,
    },
  },
  reducers: {
    SHOW(state, { key, props }) {
      const modal = {};
      _.set(modal, key, _.get(state, key));
      _.set(modal, `${key}.visible`, true);
      _.set(modal, `${key}.props`, props);

      return {
        ...state,
        ...modal,
      };
    },
    HIDE(state, { key, props }) {
      const modal = {};
      _.set(modal, key, _.get(state, key));
      _.set(modal, `${key}.visible`, false);
      _.set(modal, `${key}.props`, props);

      return {
        ...state,
        ...modal,
      };
    },
    TOGGLE(state, { key, props }) {
      const modal = {};
      const visible = _.get(state, `${key}.visible`, false);
      _.set(modal, key, _.get(state, key));
      _.set(modal, `${key}.visible`, !visible);
      _.set(modal, `${key}.props`, props);

      return {
        ...state,
        ...modal,
      };
    },
    RESET_all(state) {
      const _state = _.assign({}, state);
      _.each(_state, (value, key) => {
        _.set(_state, key, {
          visible: false,
          props: undefined,
        });
      });

      return _state;
    },
  },
};
