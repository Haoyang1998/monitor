import React, { Component, Suspense } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import { AnalysisData, OfflineDataType, OfflineChartData } from './data.d';
import styles from './style.less';

// const pieclient = new WebSocket('ws://cpu14.maas:3030');

function getActiveData() {
  const offlineData = [];
  for (let i = 0; i < 4; i += 1) {
    offlineData.push({
      name: `虚拟机 ${i}`,
      cvr: Math.ceil(Math.random() * 9) / 10,
    });
  }
  // console.log(offlineData);
  return offlineData;
}

function getChartData() {
  const offlineData = [];
  for (let i = 0; i < 10; i += 1) {
    offlineData.push({
      x: `${i}`,
      y1: Math.ceil(Math.random() * 9) / 10,
      y2: Math.ceil(Math.random() * 9) / 10,
    });
  }
  return offlineData;
}

// const client = new WebSocket('ws://123.207.89.129:5566/websocket/1');
const client2 = new WebSocket('ws://123.207.89.129:9998');

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

interface AnalysisProps {
  dashboardAndanalysis: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface AnalysisState {
  // salesType: 'all' | 'online' | 'stores';
  activeData: OfflineDataType[];
  offlineChartData: OfflineChartData[];
  currentTabKey: string;
  rangePickerValue: RangePickerValue;
}

@connect(
  ({
    dashboardAndanalysis,
    loading,
  }: {
    dashboardAndanalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAndanalysis,
    loading: loading.effects['dashboardAndanalysis/fetch'],
  }),
)
class Analysis extends Component<AnalysisProps, AnalysisState> {
  state: AnalysisState = {
    activeData: getActiveData(),
    offlineChartData: getChartData(),
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  reqRef: number = 0;

  timer: number | undefined = undefined;

  requestRef: number | undefined = undefined;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAndanalysis/fetch',
      });
    });
    // console.log(this.state.activeData);
    const win_url = window.location.href;
    var tmp = win_url.split('/');
    console.log(tmp[5]);
    // client.onopen = () => {
    //   console.log('WebSocket Client 1 Connected');
    // };
    // const tmp = this.state.currentTabKey;
    // const tmp2 = this.state.rangePickerValue;
    // client.onmessage = message => {
    //   const data = JSON.parse(message.data);
    //   // console.log(typeof (data.data));
    //   // console.log(data.chart);
    //   this.setState({
    //     offlineChartData: JSON.parse(data.chart),
    //   });
    // };
    client2.onmessage = message => {
      const data = JSON.parse(message.data);
      console.log(data);
      // console.log(typeof (data.data));
      let origindata = this.state.activeData;
      const numberPattern = /\d+/g;
      const name = JSON.parse(data.active).name;
      // console.log(typeof (data.data));
      const id = name.match(numberPattern);
      origindata[id] = JSON.parse(data.active);
      // console.log(id);
      // console.log(origindata);
      this.setState({
        activeData: origindata,
      });
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndanalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleTabChange = (key: string) => {
    this.setState({
      currentTabKey: key,
    });
    console.log(key);
  };

  handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'dashboardAndanalysis/fetchSalesData',
    });
  };

  selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'dashboardAndanalysis/fetchSalesData',
    });
  };

  isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  // eslint-disable-next-line react/sort-comp
  render() {
    const { currentTabKey, activeData, offlineChartData } = this.state;
    const { dashboardAndanalysis, loading } = this.props;
    const { visitData, offlineData } = dashboardAndanalysis;

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={visitData} />
          </Suspense>

          <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={activeData}
              offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
