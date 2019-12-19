import request from '@/utils/request';
import api from './api';

export async function getSiderBarMenu(data: object) {
  return request(api.getSiderBarMenu, {
    method: 'get',
  });
}

export async function getSiderBarModule(data: object) {
  return request(api.getSiderBarModule, {
    method: 'post',
    data: data,
  });
}

export async function getAllEnumApi(data: object) {
  return request(api.getAllEnumApi, {
    method: 'get',
    data: data,
  });
}

export async function getUserInfoApiAjax(data: object) {
  return request(api.getUserInfoApi, {
    method: 'get',
    params: data,
  });
}
