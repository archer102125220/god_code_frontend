import _ from 'lodash';
import request from '@/utils/request';

export function GET_query(model, action = null, payload = {}, token) {
  const url = `/query/${model}` + (!_.isEmpty(action) ? `/${action}`: '');
  return request.get(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
