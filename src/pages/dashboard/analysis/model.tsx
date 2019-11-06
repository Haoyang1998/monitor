import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AnalysisData } from './data.d';
import { fakeChartData, realtimedata } from './service';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    fetchChart: Effect;
    fetchSalesData: Effect;
  };
  reducers: {
    save: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
}

const initState = {
  visitData: [],
  visitData2: [],
  salesData: [],
  searchData: [],
  offlineData: [],
  offlineChartData: [],
  salesTypeData: [],
  salesTypeDataOnline: [],
  salesTypeDataOffline: [],
  radarData: [],
};

const Model: ModelType = {
  namespace: 'dashboardAndanalysis',

  state: initState,

  // subscriptions: {
  //   watchWebSocket({dispatch, history}) {
  //     return history.listen(({pathname}) => {
  //       dispatch({type: 'open'});
  //     });
  //   },
  // },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeChartData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchChart({ payload }, { call, put }) {
      const response = yield call(realtimedata, payload);
      yield put({
        type: 'save',
        payload: response.offlineChartData,
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
    // * open({payload}, {put, call}) {
    //   //wss://echo.websocket.org
    //   const config = {url: 'wss://echo.websocket.org', user_name: 'xxx', user_id: 1, room_id: 999};
    //   // service.watchList(config, (data) => {
    //   //     dispatch({type: data.type, payload: data});
    //   // });
    //   const {data} = yield call(service.watchList, config);
    //   console.log('result', data);
    // },
    // * message({payload}, {put, call}) {
    //   console.log('message', payload);
    //   yield put({type: 'messageSuccess', payload: payload.client_id});
    // },
    // * send({payload}, {put, call}) {
    //   yield call(service.send, {config: {url: 'wss://echo.websocket.org'}, data: payload});
    // },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return initState;
    },
    // openSuccess(state, action) {
    //   //client_id:1
    //   return {...state, ... action.payload}
    // },
    // messageSuccess(state, action) {
    //   //messages{type:'message',data:{....}}
    //   return {...state, ... action.payload}
    // },
  },
};

export default Model;
