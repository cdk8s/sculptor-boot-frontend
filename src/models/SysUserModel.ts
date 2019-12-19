import { Effect } from '../../typings';
import { Reducer } from 'redux';

import {
  treeListApiAjax,
} from '@/services/SysDeptService';

import {
  pageToDeptApiAjax,
  pageToRoleApiAjax,
  createApiAjax,
  updateApiAjax,
  detailApiAjax,
  deleteApiAjax,
  resetPasswordApiAjax,
  cacheEvictApiAjax,
  updateStateApiAjax,
} from '@/services/SysUserService';

export const pageToDeptApi = 'SysUserModel/pageApiToDeptEffect';
export const pageToRoleApi = 'SysUserModel/pageApiToRoleEffect';
export const createApi = 'SysUserModel/createApiEffect';
export const updateApi = 'SysUserModel/updateApiEffect';
export const detailApi = 'SysUserModel/detailApiEffect';
export const deleteApi = 'SysUserModel/deleteApiEffect';
export const resetPasswordApi = 'SysUserModel/resetPasswordApiEffect';
export const cacheEvictApi = 'SysUserModel/cacheEvictApiEffect';
export const updateStateApi = 'SysUserModel/updateStateApiEffect';
export const detailApiReducer = 'SysUserModel/detailApiReducer';
export const treeListApi = 'SysUserModel/treeListApiEffect';


export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    pageApiToDeptEffect: Effect;
    pageApiToRoleEffect: Effect;
    createApiEffect: Effect;
    updateApiEffect: Effect;
    detailApiEffect: Effect;
    deleteApiEffect: Effect;
    resetPasswordApiEffect: Effect;
    cacheEvictApiEffect: Effect;
    updateStateApiEffect: Effect;
    treeListApiEffect: Effect;
  };
  reducers: {
    pageApiReducer: Reducer<{}>;
    detailApiReducer: Reducer<{}>;
    treeListApiReducer: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysUserModel',

  state: {
    pageValue: {},
    treeListValue: [],
    detailValue: undefined,
  },

  effects: {
    * pageApiToDeptEffect({ payload }, { call, put }) {
      const response = yield call(pageToDeptApiAjax, payload);
      yield put({
        type: 'pageApiReducer',
        payload: response,
      });
    },
    * pageApiToRoleEffect({ payload }, { call, put }) {
      const response = yield call(pageToRoleApiAjax, payload);
      yield put({
        type: 'pageApiReducer',
        payload: response,
      });
    },
    * detailApiEffect({ payload }, { call, put }) {
      const response = yield call(detailApiAjax, payload);
      yield put({
        type: 'detailApiReducer',
        payload: response.data,
      });
    },
    * createApiEffect({ payload }, { call }) {
      return yield call(createApiAjax, payload);
    },
    * updateApiEffect({ payload }, { call }) {
      return yield call(updateApiAjax, payload);
    },
    * deleteApiEffect({ payload }, { call }) {
      return yield call(deleteApiAjax, payload);
    },
    * resetPasswordApiEffect({ payload }, { call }) {
      return yield call(resetPasswordApiAjax, payload);
    },
    * cacheEvictApiEffect({ payload }, { call }) {
      return yield call(cacheEvictApiAjax, payload);
    },
    * updateStateApiEffect({ payload }, { call }) {
      return yield call(updateStateApiAjax, payload);
    },
    * treeListApiEffect({ payload }, { call, put }) {
      const response = yield call(treeListApiAjax, payload);
      yield put({
        type: 'treeListApiReducer',
        payload: response,
      });
    },
  },

  reducers: {
    pageApiReducer(state, { payload }) {
      return {
        ...state,
        pageValue: payload,
      };
    },
    detailApiReducer(state, { payload }) {
      return {
        ...state,
        detailValue: payload,
      };
    },
    treeListApiReducer(state, { payload }) {
      return {
        ...state,
        treeListValue: payload.data,
      };
    },
  },
};

export default Model;
