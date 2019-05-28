import request from '@/utils/request';

export function GET_permissions(token) {
  return request.get('/permission', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
