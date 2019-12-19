import request from '@/utils/request';
import api from './api';

export async function deleteByUserIdListApiAjax(data: object) {
  return request(api.relRoleUserDeleteByUserIdListApiUrl, {
    method: 'post',
    data: data,
  });
}
export async function relRoleUserDeleteBatchCreateApiAjax(data: object) {
  return request(api.relRoleUserDeleteBatchCreateApiUrl, {
    method: 'post',
    data: data,
  });
}
