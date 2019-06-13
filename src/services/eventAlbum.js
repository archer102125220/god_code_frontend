import request from '@/utils/request';

export function GET_eventAlbums(token, payload = {}) {
  return request.get('/event_album', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function POST_eventAlbum(payload, token) {
  return request.post('/event_album', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_eventAlbum(eventAlbumId, token) {
  return request.get(`/event_album/${eventAlbumId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function PATCH_eventAlbum(eventAlbumId, payload, token) {
  return request.patch(`/event_album/${eventAlbumId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function DELETE_eventAlbum(eventAlbumId, token) {
  return request.delete(`/event_album/${eventAlbumId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function SOFTDELETE_eventAlbum(eventAlbumId, token) {
  return request.delete(`/event_album/${eventAlbumId}/delete`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function RESTOREPATCH_eventAlbum(eventAlbumId, token) {
  return request.patch(`/event_album/${eventAlbumId}/restore`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
