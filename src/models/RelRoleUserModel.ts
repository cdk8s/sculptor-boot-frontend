import { Effect } from '../../typings';

import {
  deleteByUserIdListApiAjax,
  relRoleUserDeleteBatchCreateApiAjax,
} from '@/services/RelRoleUser';

export const deleteByUserIdListApi = 'RelRoleUserModel/deleteApiEffect';
export const batchCreateApi = 'RelRoleUserModel/batchCreateApiEffect';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    deleteApiEffect: Effect;
    batchCreateApiEffect: Effect;
  };
  reducers: {};
}

const Model: ModelType = {
  namespace: 'RelRoleUserModel',

  state: {
    pageValue: {},
    treeListValue: [],
    detailValue: undefined,
  },

  effects: {
    * deleteApiEffect({ payload }, { call }) {
      return yield call(deleteByUserIdListApiAjax, payload);
    },
    * batchCreateApiEffect({ payload }, { call }) {
      return yield call(relRoleUserDeleteBatchCreateApiAjax, payload);
    },
  },

  reducers: {},
};

export default Model;
