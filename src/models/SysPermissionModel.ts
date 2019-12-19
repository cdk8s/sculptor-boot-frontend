import { Effect } from '../../typings';
import { Reducer } from 'redux';

import {
  treeListApiAjax,
  createApiAjax,
  updateApiAjax,
  detailApiAjax,
  deleteApiAjax,
  cacheEvictApiAjax,
  updateStateApiAjax,
  relPermissionRoleListApiAjax,
  relPermissionRoleBatchCreateApiAjax,
} from '@/services/SysPermissionService';

export const treeListApi = 'SysPermissionModel/treeListApiEffect';
export const createApi = 'SysPermissionModel/createApiEffect';
export const updateApi = 'SysPermissionModel/updateApiEffect';
export const detailApi = 'SysPermissionModel/detailApiEffect';
export const deleteApi = 'SysPermissionModel/deleteApiEffect';
export const cacheEvictApi = 'SysPermissionModel/cacheEvictApiEffect';
export const updateStateApi = 'SysPermissionModel/updateStateApiEffect';
export const detailApiReducer = 'SysPermissionModel/detailApiReducer';
export const relPermissionRoleListApi = 'SysPermissionModel/relPermissionRoleListApiEffect';
export const relPermissionRoleBatchCreateApi = 'SysPermissionModel/relPermissionRoleBatchCreateApiEffect';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    treeListApiEffect: Effect;
    createApiEffect: Effect;
    updateApiEffect: Effect;
    detailApiEffect: Effect;
    deleteApiEffect: Effect;
    cacheEvictApiEffect: Effect;
    updateStateApiEffect: Effect;
    relPermissionRoleListApiEffect: Effect;
    relPermissionRoleBatchCreateApiEffect: Effect;
  };
  reducers: {
    treeListApiReducer: Reducer<{}>;
    detailApiReducer: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysPermissionModel',

  state: {
    treeListValue: [],
    detailValue: undefined,
  },

  effects: {
    * treeListApiEffect({ payload }, { call, put }) {
      const response = yield call(treeListApiAjax, payload);
      yield put({
        type: 'treeListApiReducer',
        payload: response.data,
      });
    },
    * createApiEffect({ payload }, { call }) {
      return yield call(createApiAjax, payload);
    },
    * updateApiEffect({ payload }, { call }) {
      return yield call(updateApiAjax, payload);
    },
    * detailApiEffect({ payload }, { call, put }) {
      const response = yield call(detailApiAjax, payload);
      yield put({
        type: 'detailApiReducer',
        payload: response.data,
      });
      return response.data;
    },
    * deleteApiEffect({ payload }, { call }) {
      return yield call(deleteApiAjax, payload);
    },
    * cacheEvictApiEffect({ payload }, { call }) {
      return yield call(cacheEvictApiAjax, payload);
    },
    * updateStateApiEffect({ payload }, { call }) {
      return yield call(updateStateApiAjax, payload);
    },
    * relPermissionRoleListApiEffect({ payload }, { call }) {
      return yield call(relPermissionRoleListApiAjax, payload);
    },
    * relPermissionRoleBatchCreateApiEffect({ payload }, { call }) {
      return yield call(relPermissionRoleBatchCreateApiAjax, payload);
    },
  },

  reducers: {
    treeListApiReducer(state, { payload }) {
      return {
        ...state,
        treeListValue: payload,
      };
    },
    detailApiReducer(state, { payload }) {
      return {
        ...state,
        detailValue: payload,
      };
    },
  },
};

export default Model;
