import { Reducer } from 'redux';
import { getSiderBarMenu, getSiderBarModule, getAllEnumApi, getUserInfoApiAjax } from '@/services/global';
import { Effect } from '../../typings';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    getSiderBarMenu: Effect;
    getSiderBarModule: Effect;
    getAllEnum: Effect;
    getUserInfoEffect: Effect;
  };
  reducers: {
    setRouterTabs: Reducer<{}>;
    setCurrentPath: Reducer<{}>;
    setSidebarSelectKey: Reducer<{}>;
    setSidebarOpenKey: Reducer<{}>;
    setSidebarCloneOpenKey: Reducer<{}>;
    setSiderBarMenu: Reducer<{}>;
    setSiderModule: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'global',

  state: {
    routerTabs: [],
    currentPath: window.location.pathname,
    sidebarSelectKey: [],
    sidebarOpenKey: [],
    sidebarCloneOpenKey: [],
    siderMenu: [],
    siderModule: [],
  },

  effects: {
    * getSiderBarMenu({ payload }, { call, put }) {
      const response = yield call(getSiderBarMenu, payload);
      yield put({
        type: 'setSiderBarMenu',
        payload: response.data,
      });
      return response.data;
    },

    * getSiderBarModule({ payload }, { call, put }) {
      const response = yield call(getSiderBarModule, payload);
      yield put({
        type: 'setSiderModule',
        payload: response.data,
      });
      return response.data;
    },

    * getAllEnum({ payload }, { call, put }) {
      return yield call(getAllEnumApi, payload);
    },
    * getUserInfoEffect({ payload }, { call, put }) {
      return yield call(getUserInfoApiAjax, payload);
    },
  },

  reducers: {
    setSiderBarMenu(state, { payload }) {
      return {
        ...state,
        siderMenu: payload,
      };
    },
    setSiderModule(state, { payload }) {
      return {
        ...state,
        siderModule: payload,
      };
    },
    setRouterTabs(state, { payload }) {
      localStorage.setItem('routerTabs', JSON.stringify(payload));
      return {
        ...state,
        routerTabs: payload,
      };
    },
    setCurrentPath(state, { payload }) {
      return {
        ...state,
        currentPath: payload,
      };
    },
    setSidebarSelectKey(state, { payload }) {
      return {
        ...state,
        sidebarSelectKey: payload,
      };
    },
    setSidebarOpenKey(state, { payload }) {
      return {
        ...state,
        sidebarOpenKey: payload,
      };
    },
    setSidebarCloneOpenKey(state, { payload }) {
      return {
        ...state,
        sidebarCloneOpenKey: payload,
      };
    },
  },
};

export default Model;
