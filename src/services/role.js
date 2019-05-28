import request from '@/utils/request';

export function GET_roles(token) {
  return request.get('/role', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function POST_role(payload, token) {
  return request.post('/role', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_role(roleId, token) {
  return request.get(`/role/${roleId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function PATCH_role(roleId, payload, token) {
  return request.patch(`/role/${roleId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function DELETE_role(roleId, token) {
  return request.delete(`/role/${roleId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
