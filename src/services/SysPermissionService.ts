import request from '@/utils/request';
import api from './api';

export async function pageApiAjax(data: object) {
  return request(api.sysPermissionPageApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function treeListApiAjax(data: object) {
  return request(api.sysPermissionTreeListApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysPermissionDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysPermissionCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysPermissionUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysPermissionDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysPermissionCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function updateStateApiAjax(data: object) {
  return request(api.sysPermissionUpdateStateApiUrl, {
    method: 'post',
    data: data,
  });
}
export async function relPermissionRoleListApiAjax(data: object) {
  return request(api.relPermissionRoleListApiUrl, {
    method: 'post',
    data: data,
  });
}
export async function relPermissionRoleBatchCreateApiAjax(data: object) {
  return request(api.relPermissionRoleBatchCreateApiUrl, {
    method: 'post',
    data: data,
  });
}
