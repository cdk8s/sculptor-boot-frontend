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
} from '@/services/SysDictService';

export const pageApiToLeft = 'SysDictModel/pageApiEffectToLeft';
export const createApiToLeft = 'SysDictModel/createApiEffectToLeft';
export const updateApiToLeft = 'SysDictModel/updateApiEffectToLeft';
export const detailApiToLeft = 'SysDictModel/detailApiEffectToLeft';
export const deleteApiToLeft = 'SysDictModel/deleteApiEffectToLeft';
export const cacheEvictApiToLeft = 'SysDictModel/cacheEvictApiEffectToLeft';
export const updateStateApiToLeft = 'SysDictModel/updateStateApiEffectToLeft';
export const detailApiReducerToLeft = 'SysDictModel/detailApiReducerToLeft';

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
  namespace: 'SysDictModel',

  state: {
    pageValueToLeft: {},
    detailValueToLeft: undefined,
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
    * updateStateApiEffectToLeft({ payload }, { call, put }) {
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
