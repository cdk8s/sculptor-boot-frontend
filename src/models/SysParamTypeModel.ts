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
} from '@/services/SysParamTypeService';

export const pageApiToLeft = 'SysParamTypeModel/pageApiEffectToLeft';
export const createApiToLeft = 'SysParamTypeModel/createApiEffectToLeft';
export const updateApiToLeft = 'SysParamTypeModel/updateApiEffectToLeft';
export const detailApiToLeft = 'SysParamTypeModel/detailApiEffectToLeft';
export const deleteApiToLeft = 'SysParamTypeModel/deleteApiEffectToLeft';
export const cacheEvictApiToLeft = 'SysParamTypeModel/cacheEvictApiEffectToLeft';
export const updateStateApiToLeft = 'SysParamTypeModel/updateStateApiEffectToLeft';
export const detailApiReducerToLeft = 'SysParamTypeModel/detailApiReducer';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    pageApiEffectToLeft: Effect;
    createApiEffectToLeft: Effect;
    updateApiEffectToLeft: Effect;
    detailApiEffectToLeft: Effect;
    deleteApiEffectToLeft: Effect;
    cacheEvictApiEffectToLeft: Effect;
    updateStateApiEffectToLeft: Effect;
  };
  reducers: {
    pageApiReducerToLeft: Reducer<{}>;
    detailApiReducerToLeft: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysParamTypeModel',

  state: {
    pageValueToRight: {},
    detailValueToRight: undefined,
  },

  effects: {
    * pageApiEffectToLeft({ payload }, { call, put }) {
      const response = yield call(pageApiAjax, payload);
      yield put({
        type: 'pageApiReducerToLeft',
        payload: response,
      });
    },
    * detailApiEffectToLeft({ payload }, { call, put }) {
      const response = yield call(detailApiAjax, payload);
      yield put({
        type: 'detailApiReducerToLeft',
        payload: response.data,
      });
    },
    * createApiEffectToLeft({ payload }, { call }) {
      return yield call(createApiAjax, payload);
    },
    * updateApiEffectToLeft({ payload }, { call }) {
      return yield call(updateApiAjax, payload);
    },
    * deleteApiEffectToLeft({ payload }, { call }) {
      return yield call(deleteApiAjax, payload);
    },
    * cacheEvictApiEffectToLeft({ payload }, { call }) {
      return yield call(cacheEvictApiAjax, payload);
    },
    * updateStateApiEffectToLeft({ payload }, { call }) {
      return yield call(updateStateApiAjax, payload);
    },
  },

  reducers: {
    pageApiReducerToLeft(state, { payload }) {
      return {
        ...state,
        pageValueToLeft: payload,
      };
    },
    detailApiReducerToLeft(state, { payload }) {
      return {
        ...state,
        detailValueToLeft: payload,
      };
    },
  },
};

export default Model;
