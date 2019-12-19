import request from '@/utils/request';
import api from './api';

export async function pageToDeptApiAjax(data: object) {
  return request(api.sysUserPageToDeptApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function pageToRoleApiAjax(data: object) {
  return request(api.sysUserPageToRoleApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function detailApiAjax(data: object) {
  return request(api.sysUserDetailApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function createApiAjax(data: object) {
  return request(api.sysUserCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function updateApiAjax(data: object) {
  return request(api.sysUserUpdateApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function deleteApiAjax(data: object) {
  return request(api.sysUserDeleteApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function resetPasswordApiAjax(data: object) {
  return request(api.sysUserResetPasswordApiUrl, {
    method: 'post',
    data: data,
  });
}

export async function cacheEvictApiAjax(data: object) {
  return request(api.sysUserCacheEvictApiUrl, {
    method: 'get',
    params: data,
  });
}

export async function updateStateApiAjax(data: object) {
  return request(api.sysUserUpdateStateApiUrl, {
    method: 'post',
    data: data,
  });
}
