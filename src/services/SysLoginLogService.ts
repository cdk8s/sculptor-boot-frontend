import request from '@/utils/request';
import api from './api';

export async function pageApiAjax(data: object) {
  return request(api.sysLoginLogPageApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysLoginLogDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysLoginLogCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysLoginLogUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysLoginLogDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysLoginLogCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

