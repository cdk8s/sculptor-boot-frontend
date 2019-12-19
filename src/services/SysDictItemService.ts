import request from '@/utils/request';
import api from './api';

export async function pageApiAjax(data: object) {
  return request(api.sysDictItemPageApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysDictItemDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysDictItemCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysDictItemUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysDictItemDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysDictItemCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function updateStateApiAjax(data: object) {
  return request(api.sysDictItemUpdateStateApiUrl, {
    method: 'post',
    data: data,
  });
}
