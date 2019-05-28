import request from '@/utils/request';

export function GET_eventTypes(token, payload = {}) {
  return request.get('/event_type', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function POST_eventType(payload, token) {
  return request.post('/event_type', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_eventType(eventTypeId, token) {
  return request.get(`/event_type/${eventTypeId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function PATCH_eventType(eventTypeId, payload, token) {
  return request.patch(`/event_type/${eventTypeId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function DELETE_eventType(eventTypeId, token) {
  return request.delete(`/event_type/${eventTypeId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function SOFTDELETE_eventType(eventTypeId, token) {
  return request.delete(`/event_type/${eventTypeId}/delete`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function RESTOREPATCH_eventType(eventTypeId, token) {
  return request.patch(`/event_type/${eventTypeId}/restore`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
