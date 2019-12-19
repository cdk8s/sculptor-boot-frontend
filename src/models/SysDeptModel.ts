import { Effect } from '../../typings';
import { Reducer } from 'redux';

import {
  pageToDeptApiAjax,
} from '@/services/SysUserService';

import {
  treeListApiAjax,
  createApiAjax,
  updateApiAjax,
  detailApiAjax,
  deleteApiAjax,
  cacheEvictApiAjax,
  assignUserDeptTreeListApiAjax,
} from '@/services/SysDeptService';

export const treeListApi = 'SysDeptModel/treeListApiEffect';
export const createApi = 'SysDeptModel/createApiEffect';
export const updateApi = 'SysDeptModel/updateApiEffect';
export const detailApi = 'SysDeptModel/detailApiEffect';
export const deleteApi = 'SysDeptModel/deleteApiEffect';
export const cacheEvictApi = 'SysDeptModel/cacheEvictApiEffect';
export const assignUserDeptTreeListApi = 'SysDeptModel/assignUserDeptTreeListApiEffect';
export const assignUserPageApi = 'SysDeptModel/assignUserPageApiEffect';
export const detailApiReducer = 'SysDeptModel/detailApiReducer';

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
    assignUserDeptTreeListApiEffect: Effect;
    assignUserPageApiEffect: Effect;
  };
  reducers: {
    treeListApiReducer: Reducer<{}>;
    detailApiReducer: Reducer<{}>;
    assignUserDeptTreeListApiReducer: Reducer<{}>;
    assignUserPageApiReducer: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysDeptModel',

  state: {
    treeListValue: [],
    detailValue: undefined,
    assignUserDeptTreeListValue: [],
    assignUserPageValue: {},
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
    * assignUserDeptTreeListApiEffect({ payload }, { call, put }) {
      const response = yield call(assignUserDeptTreeListApiAjax, payload);
      yield put({
        type: 'assignUserDeptTreeListApiReducer',
        payload: response.data,
      });
    },
    * assignUserPageApiEffect({ payload }, { call, put }) {
      const response = yield call(pageToDeptApiAjax, payload);
      yield put({
        type: 'assignUserPageApiReducer',
        payload: response,
      });
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

    assignUserDeptTreeListApiReducer(state, { payload }) {
      return {
        ...state,
        assignUserDeptTreeListValue: payload,
      };
    },
    assignUserPageApiReducer(state, { payload }) {
      return {
        ...state,
        assignUserPageValue: payload,
      };
    },
  },
};

export default Model;
