import request from '@/utils/request';
import api from './api';

export async function pageApiAjax(data: object) {
  return request(api.sysDeptPageApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysDeptDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysDeptCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysDeptUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysDeptDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysDeptCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function assignUserDeptTreeListApiAjax(data: object) {
  return request(api.sysDeptTreeListApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function treeListApiAjax(data: object) {
  return request(api.sysDeptTreeListApiUrl, {
    method: 'get',
    params: data,
  });
}


