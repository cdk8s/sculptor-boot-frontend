import request from '@/utils/request';
import api from './api';

export async function listApiAjax(data: object) {
  return request(api.relDeptUserListApiUrl, {
    method: 'post',
    data: data,
  });
}
export async function relDeptUserBatchCreateApiAjax(data: object) {
  return request(api.relDeptUserBatchCreateApiUrl, {
    method: 'post',
    data: data,
  });
}

