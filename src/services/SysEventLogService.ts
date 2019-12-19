import request from '@/utils/request';
import api from './api';

export async function pageApiAjax(data: object) {
  return request(api.sysEventLogPageApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysEventLogDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysEventLogCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysEventLogUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysEventLogDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysEventLogCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

