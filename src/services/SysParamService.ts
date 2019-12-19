import request from '@/utils/request';
import api from './api';

export async function pageApiAjax(data: object) {
  return request(api.sysParamPageApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysParamDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysParamCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysParamUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysParamDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysParamCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function updateStateApiAjax(data: object) {
  return request(api.sysParamUpdateStateApiUrl, {
    method: 'post',
    data: data,
  });
}
