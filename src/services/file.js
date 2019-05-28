import request from '@/utils/request';
import JSFileDownload from 'js-file-download';

export function GET_files(token, payload = {}) {
  return request.get('/file', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function GET_file(fileId, token) {
  return request.get(`/file/${fileId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function DOWNLOAD_file(fileModel, token) {
  const { id, name, mimetype } = fileModel;
  return request.post(`/file/${id}/download`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  }).then((response) => {
    JSFileDownload(response, name, mimetype);
  });
}
