import request from '@/utils/request';

export function GET_users(token) {
  return request.get('/user', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function POST_user(payload, token) {
  return request.post('/user', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_user(userId, token) {
  return request.get(`/user/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function PATCH_user(userId, payload, token) {
  return request.patch(`/user/${userId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function DELETE_user(userId, token) {
  return request.delete(`/user/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function SOFTDELETE_user(userId, token) {
  return request.delete(`/user/${userId}/delete`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function RESTOREPATCH_user(userId, token) {
  return request.patch(`/user/${userId}/restore`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
