import request from '@/utils/request';

export function GET_logs(token, payload = {}) {
  return request.get('/log', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_log(logId, token) {
  return request.get(`/log/${logId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
