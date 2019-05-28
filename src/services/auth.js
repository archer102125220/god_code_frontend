import request from '@/utils/request';

export function POST_login(username, password) {
  return request.post('/auth/login', {
    username, password,
  });
}

export function GET_refresh(token) {
  return request.get('/auth/refresh', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_profile(token) {
  return request.get('/auth/profile', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function POST_profile(payload, token) {
  return request.post('/auth/profile', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function POST_resetPassword(username, email) {
  return request.post('/auth/reset/password', {
    username, email,
  });
}

export function PATCH_resetPassword(password, password_confirmation, token) {
  return request.patch('/auth/reset/password', {
    password, password_confirmation, token,
  });
}
