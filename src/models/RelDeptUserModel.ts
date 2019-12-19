import { Effect } from '../../typings';

import {
  listApiAjax,
  relDeptUserBatchCreateApiAjax,
} from '@/services/RelDeptUser';

export const listApi = 'RelDeptUserModel/listApiEffect';
export const batchCreateApi = 'RelDeptUserModel/batchCreateEffect';


export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    listApiEffect: Effect;
    batchCreateEffect: Effect;
  };
  reducers: {};
}

const Model: ModelType = {
  namespace: 'RelDeptUserModel',

  state: {
    pageValue: {},
    treeListValue: [],
    detailValue: undefined,
  },

  effects: {
    * listApiEffect({ payload }, { call }) {
      return yield call(listApiAjax, payload);
    },
    * batchCreateEffect({ payload }, { call }) {
      return yield call(relDeptUserBatchCreateApiAjax, payload);
    },
  },

  reducers: {},
};

export default Model;
