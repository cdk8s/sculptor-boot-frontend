import { Effect } from '../../typings';
import { Reducer } from 'redux';

import {
  pageApiAjax,
  createApiAjax,
  updateApiAjax,
  detailApiAjax,
  deleteApiAjax,
  cacheEvictApiAjax,
} from '@/services/SysEmployeeService';

export const pageApi = 'SysEmployeeModel/pageApiEffect';
export const createApi = 'SysEmployeeModel/createApiEffect';
export const updateApi = 'SysEmployeeModel/updateApiEffect';
export const detailApi = 'SysEmployeeModel/detailApiEffect';
export const deleteApi = 'SysEmployeeModel/deleteApiEffect';
export const cacheEvictApi = 'SysEmployeeModel/cacheEvictApiEffect';
export const detailApiReducer = 'SysEmployeeModel/detailApiReducer';

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
  };
  reducers: {
    pageApiReducer: Reducer<{}>;
    detailApiReducer: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysEmployeeModel',

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
