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
} from '@/services/SysDictItemService';

export const pageApiToRight = 'SysDictItemModel/pageApiEffectToRight';
export const createApiToRight = 'SysDictItemModel/createApiEffectToRight';
export const updateApiToRight = 'SysDictItemModel/updateApiEffectToRight';
export const detailApiToRight = 'SysDictItemModel/detailApiEffectToRight';
export const deleteApiToRight = 'SysDictItemModel/deleteApiEffectToRight';
export const cacheEvictApiToRight = 'SysDictItemModel/cacheEvictApiEffectToRight';
export const updateStateApiToRight = 'SysDictItemModel/updateStateApiEffectToRight';
export const detailApiReducerToRight = 'SysDictItemModel/detailApiReducerToRight';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    pageApiEffectToRight: Effect;
    createApiEffectToRight: Effect;
    updateApiEffectToRight: Effect;
    detailApiEffectToRight: Effect;
    deleteApiEffectToRight: Effect;
    cacheEvictApiEffectToRight: Effect;
    updateStateApiEffectToRight: Effect;
  };
  reducers: {
    pageApiReducerToRight: Reducer<{}>;
    detailApiReducerToRight: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'SysDictItemModel',

  state: {
    pageValueToRight: {},
    detailValueToRight: undefined,
  },

  effects: {
    * pageApiEffectToRight({ payload }, { call, put }) {
      const response = yield call(pageApiAjax, payload);
      yield put({
        type: 'pageApiReducerToRight',
        payload: response,
      });
    },
    * detailApiEffectToRight({ payload }, { call, put }) {
      const response = yield call(detailApiAjax, payload);
      yield put({
        type: 'detailApiReducerToRight',
        payload: response.data,
      });
    },
    * createApiEffectToRight({ payload }, { call }) {
      return yield call(createApiAjax, payload);
    },
    * updateApiEffectToRight({ payload }, { call }) {
      return yield call(updateApiAjax, payload);
    },
    * deleteApiEffectToRight({ payload }, { call }) {
      return yield call(deleteApiAjax, payload);
    },
    * cacheEvictApiEffectToRight({ payload }, { call }) {
      return yield call(cacheEvictApiAjax, payload);
    },
    * updateStateApiEffectToRight({ payload }, { call, put }) {
      return yield call(updateStateApiAjax, payload);
    },
  },

  reducers: {
    pageApiReducerToRight(state, { payload }) {
      return {
        ...state,
        pageValueToRight: payload,
      };
    },
    detailApiReducerToRight(state, { payload }) {
      return {
        ...state,
        detailValueToRight: payload,
      };
    },
  },
};

export default Model;
