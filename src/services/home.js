import request from '@/utils/request';

export function GET_statistics(token) {
  return request.get('/home/statistics', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_newsies(token) {
  return request.get('/home/news', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_news(newsId, token) {
  return request.get(`/home/news/${newsId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
