import request from '@/utils/request';

export function GET_configs(token) {
  return request.get('/config', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function PATCH_config(payload, token) {
  return request.patch(`/config`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

