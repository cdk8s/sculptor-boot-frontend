import { Effect } from '../../typings';
import { Reducer } from 'redux';

import {
  pageApiAjax,
  createApiAjax,
  updateApiAjax,
  detailApiAjax,
  deleteApiAjax,
  cacheEvictApiAjax,
  updateStateApiAjax,
} from '@/services/SysRoleService';

export const pageApi = 'SysRoleModel/pageApiEffect';
export const createApi = 'SysRoleModel/createApiEffect';
export const updateApi = 'SysRoleModel/updateApiEffect';
export const detailApi = 'SysRoleModel/detailApiEffect';
export const deleteApi = 'SysRoleModel/deleteApiEffect';
export const cacheEvictApi = 'SysRoleModel/cacheEvictApiEffect';
export const updateStateApi = 'SysRoleModel/updateStateApiEffect';
export const detailApiReducer = 'SysRoleModel/detailApiReducer';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    pageApiEffect: Effect;
    createApiEffect: Effect;
    updateApiEffect: Effect;
    detailApiEffect: Effect;
    deleteApiEffect: Effect;
    cacheEvictApiEffect: Effect;
    updateStateApiEffect: Effect;
  };
  reducers: {
    pageApiReducer: Reducer<{}>;
    detailApiReducer: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysRoleModel',

  state: {
    pageValue: {},
    detailValue: undefined,
  },

  effects: {
    * pageApiEffect({ payload }, { call, put }) {
      const response = yield call(pageApiAjax, payload);
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
    * cacheEvictApiEffect({ payload }, { call }) {
      return yield call(cacheEvictApiAjax, payload);
    },
    * updateStateApiEffect({ payload }, { call }) {
      return yield call(updateStateApiAjax, payload);
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
  },
};

export default Model;
