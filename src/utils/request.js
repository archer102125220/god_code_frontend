import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';
import APIConfig from '@/config/api';

const ax = axios.create({
  baseURL: APIConfig.baseUrl,
  timeout: 180000,
});

function responseData(res) {
  return res.data;
}

function generateShortCutMethod(_method) {
  return (_path, _params = {}, _extendOption = {}) => {
    return call(_path, _.toUpper(_method), _params, _extendOption);
  };
}

function call(_path, _method, _params = {}, _extendOption = {}) {
  let option = {
    url: _path,
    method: _method,
    paramsSerializer: (params) => {
      return qs.stringify(params, { encodeValuesOnly: true });
    }
  };
  switch (_.toUpper(_method)) {
    case 'PUT':
    case 'POST':
    case 'PATCH':
      option.data = _params;
      break;
    case 'GET':
      option.params = _params;
      break;
    default:
      break;
  }
  option = {
    ...option,
    ..._extendOption,
  };
  return ax.request(option)
    .then(responseData)
    .catch(function (err) {
      // Remove This When Axios Release Issue#1415
      _.set(err, 'isAxiosError', true);
      throw err
    });
}

export default {
  call,
  url: path => `${APIConfig.baseUrl}${path}`,
  get: generateShortCutMethod('GET'),
  post: generateShortCutMethod('POST'),
  put: generateShortCutMethod('PUT'),
  patch: generateShortCutMethod('PATCH'),
  delete: generateShortCutMethod('DELETE'),
};
