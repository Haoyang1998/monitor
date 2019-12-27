import React, { Component, Suspense } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import { AnalysisData, OfflineDataType, OfflineChartData, VisitDataType, bwDataType } from './data.d';
import { match } from 'path-to-regexp';

// const pieclient = new WebSocket('ws://cpu14.maas:3030');

// function getActiveData() {
//   const offlineData = [];
//   for (let i = 0; i < 2; i += 1) {
//     offlineData.push({
//       name: `虚拟机 ${i}`,
//       cvr: Math.ceil(Math.random() * 9) / 10,
//     });
//   }
//   // console.log(offlineData);
//   return offlineData;
// }

function getAccuracyData() {
  const accuracy: number[] = [];
  accuracy[0] = parseFloat(((Math.random()*20)+80).toFixed(2));
  accuracy[2] = accuracy[0] - 5;
  accuracy[1] = parseFloat((accuracy[2]/5).toFixed(2));
  return accuracy;
}

function getAccuracyData5() {
  const accuracy: number[] = [];
  accuracy[0] = parseFloat(((Math.random()*20)+80).toFixed(2));
  accuracy[2] = accuracy[0] - 5;
  accuracy[1] = parseFloat((accuracy[2]/5).toFixed(2));
  return accuracy;
}

function getVisitSecData() {
  const fakeY = [227.58, 227.80, 226.43, 227.88, 226.92, 226.51, 227.08, 227.80, 228.34, 228.53]
  const f_data: VisitDataType[] = [];
  //console.log("--------------\n"+t);
  for (let i = 0; i < fakeY.length; i += 1) {
    f_data.push({
      x: `step ${i*5+15}`,
      y: fakeY[i],
    });
  }
  return f_data;
}

function getVisitData() {
  const fakeY = [1.7, 1.5, 1.4, 1.2, 1.1, 1.1, 0.9, 0.6, 0.5, 0.3, 0.1, 0.1, 0.0, 0.0]
  const f_data: VisitDataType[] = [];
  //console.log("--------------\n"+t);
  for (let i = 0; i < fakeY.length; i += 1) {
    f_data.push({
      x: `step ${i}`,
      y: fakeY[i],
    });
  }
  return f_data;
}

function getChartData() {
  const offlineData = [];
  let t = Math.round(new Date().getTime());
  //console.log("--------------\n"+t);
  for (let i = 0; i < 5; i += 1) {
    offlineData.push({
      x: t,
      y1: Math.random() * 10,
      // y2: Math.ceil(Math.random() * 9) / 10,
      //Math.ceil(Math.random() * 9) / 
    });
    t += 3000;
  }
  return offlineData;
}

function getChartDataFromBw(list:bwDataType){
  const offlineData = [];
  let t = Math.round(new Date().getTime());
  //console.log("--------------\n"+t);
  
  if (list == null){
    //console.log("null!!!!");
    return getChartData();}
  else
    {for (let i = 0; i < list.y.length; i += 1) {
      offlineData.push({
        x: t,
        y1: list.y[i],
        // y2: Math.ceil(Math.random() * 9) / 10,
        //Math.ceil(Math.random() * 9) / 
      });
      t += 3000;
    }
    return offlineData;}
}

function getHighLowAverage(list:number[]){
  //console.log("cpuusage________________");
  const len = list.length;
  let A, H, L;
  var a = 0.0;
  var h = 0.0;
  var l = 0.0;
  for (let index = 0; index < len; index++) {
    if (h<list[index]) {
      h = list[index];
    }
    if (l>list[index]) {
      l = list[index];
    }
    a = a + list[index];
  }
  if(len > 0)
    a = a/len;
  else
    a = parseFloat((Math.random()*100).toFixed(1));
    // 测试 记得删！！！！！！！！！！！！
  return {
    A:a,H:h,L:l
  }
}

function getCpuData(){
  const f_cpu_data = [];
  f_cpu_data[1] = parseFloat((Math.random()+99).toFixed(2));
  f_cpu_data[2] = parseFloat((Math.random()*40).toFixed(2));
  f_cpu_data[0] = parseFloat((Math.random()*(f_cpu_data[1] - f_cpu_data[2]) + f_cpu_data[2]).toFixed(2));
  return f_cpu_data;
}

function getLossvalData(){
  const f_loss_data = [];
  f_loss_data[0] = parseFloat((Math.random()).toFixed(2));
  f_loss_data[1] = parseFloat((Math.random()*100).toFixed(2));
  return f_loss_data;
}

//向监控平台发送请求
// const client = new WebSocket('ws://172.17.255.211:9999');
// const client2 = new WebSocket('ws://123.207.89.129:9998');
const bwhistory_client  =  new WebSocket('ws://172.17.255.211:80/usage')
const hoseusage_client  =  new WebSocket('ws://172.17.255.211:80/hoseusage');
const cpuusage_client   =  new WebSocket('ws://172.17.255.211:80/cpuusage');
const cnn_client        =  new WebSocket('ws://172.17.255.211:80/cnn_request');
const cnnhist_client    =  new WebSocket('ws://172.17.255.211:80/cnn_his');

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
  cpuusage : number[];
  lossval: number[];
  visData: VisitDataType[];
  visData2: VisitDataType[];
  accuracy1: number[];
  accuracy5: number[];
  bwhis: bwDataType[];
  jitter: number;
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
    activeData: [],
    offlineChartData: getChartData(),
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    cpuusage: getCpuData(),
    lossval: getLossvalData(),
    visData: getVisitData(),
    visData2: getVisitSecData(),
    accuracy1: getAccuracyData(),
    accuracy5: getAccuracyData(),
    bwhis: [],
    jitter: 0.0,
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
    
    // related param
    var acdata: OfflineDataType[] = [];
    var vm_index:string[] = [];
    var vm_ips: string[] = [];
    var usage: number[] = [];
    var bwhistory: bwDataType[] = [];
    var cnn_param: number[] = [];
    var cnn_his: VisitDataType[] = [];
    var cpuusage_list: number[] = [];
    var cpuusage_avr = 0.0;
    var cpuusage_max = 0.0;
    var cpuusage_min = 0.0;
    var acc1: number[] = [];
    var acc5: number[] = [];
    var jit = 0.0;

    //读取url，获取vm的ip 
    //5: hosemodel id
    //6: number of vm
    //7: vm ip (base64)
    const win_url = window.location.href;
    let tmp = win_url.split('/');
    //window.alert(tmp[6]);
    let splitpattern = /&|=/g;
    let vm = window.atob(tmp[6]).split(splitpattern);
    
    for (let index = 1; index < vm.length; index++) {
      if(index % 2 == 0)
        vm_ips[index / 2 - 1 ] = vm[index].replace(/\./g,'-');
      else
          vm_index[( index - 1 ) / 2] = vm[index];
    }

    //获取bwusage数据 bwusage 未测试
    this.bwhistoryHandler(bwhistory,vm_ips,vm_index);
    console.log(bwhistory);

    //获取hoseusage数据 usage 未修改
    this.hoseusageHandler(usage,vm_ips);

    console.log(usage);
    console.log("-------usagehis-------");

    //获取 虚拟机 
    this.getacdata(acdata, usage,vm_index);
    
    //获取 cnn spead_mean 传输不能实时刷新
    this.cnnhisHandler(cnn_his,vm_ips);

    console.log(cnn_his);
    console.log("-------cnnhis-------");

    //获取 cpuusage
    this.cpuusageHandler(cpuusage_list,cpuusage_max,cpuusage_min,vm_ips);
    var obj = getHighLowAverage(cpuusage_list);
    cpuusage_avr = obj.A;
    var cpu: number[] = [];
    cpu = [cpuusage_avr,cpuusage_max,cpuusage_min];

    //获取 lossval,accuracy,jit test
    this.cnnHandler(cnn_param,acc1,acc5,jit,vm_ips);

    
    // console.log(vm_ips);

    this.setState({
      activeData: acdata,
      currentTabKey: `虚拟机 ${vm_index[0]}`,
      bwhis: bwhistory,
      visData2: cnn_his == null ? cnn_his : getVisitSecData(),
    //   offlineChartData: getChartDataFromBw(bwhistory.find()),
      accuracy1: acc1 ,
      accuracy5: acc5 ,
      cpuusage: cpu, 
      lossval: cnn_param,
    });

    setInterval(()=>{

    this.setState({
      
    });
    },1000)
    
}

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndanalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  //vm
  getacdata = (acdata:OfflineDataType[],usage:number[],vm_index:string[]) => {
    let cur = 0.0;
    for (let index = 0; index < vm_index.length; index++) {
      if(usage.length > 0)
        cur = usage[index];
      else
        cur = parseFloat(Math.random().toFixed(2));
      acdata.push({
        name: `虚拟机 ${vm_index[index]}`,
        cvr: cur,
      });
    }
  }

  //bwusagehandler bwhistory
  bwhistoryHandler = (usage:bwDataType[], vm_ips:string[], vm_index:string[]) => {
    //获取bwusage数据 usage
    //send 格式: {"vm":["172-17-191-254","172-17-191-256"]}
    bwhistory_client.onopen = () =>{
      let ips_json = JSON.stringify(vm_ips);
      let request = `{\"vm\":${ips_json}}`
      bwhistory_client.send(request);
      console.log("bwhis open!!!!!!!!");
      //console.log(request);
    }
    bwhistory_client.onmessage = bw_message => {
      //console.log(bw_message.data);
      const data = JSON.parse(bw_message.data);
      for (let index = 0; index < vm_ips.length; index++) {
        // usage[vm_ips[index]] = data[vm_ips[index]];   
        usage.push({
          x: `虚拟机 ${vm_index[index]}`,
          y: data[vm_ips[index]]? data[vm_ips[index]]:0,
        });     
      }
      console.log(usage);
      console.log("bandwith---")
      bwhistory_client.close();
    }
    bwhistory_client.onclose = () =>{
      //console.log("hoseusage connection closed!!!");
    }
  }

  //hoseusagehandler bw
  hoseusageHandler = (usage:number[],vm_ips:string[]) => {
    //获取hoseusage数据 usage
    //send 格式: {"vm":["172-17-191-254","172-17-191-256"]}
    hoseusage_client.onopen = () =>{
      let ips_json = JSON.stringify(vm_ips);
      let request = `{\"vm\":${ips_json}}`
      hoseusage_client.send(request);
      console.log("hoseusage open!!!!!!!!");
      //console.log(request);
    }
    hoseusage_client.onmessage = hose_message => {
      //console.log(hose_message.data);
      const data = JSON.parse(hose_message.data);
      for (let index = 0; index < vm_ips.length; index++) {
        usage[index] = data[vm_ips[index]];        
      }
      //window.alert(usage);
      hoseusage_client.close();
    }
    hoseusage_client.onclose = () =>{
      console.log("hoseusage connection closed!!!");
    }
  }

  //cnnhisHandler speed_mean
  cnnhisHandler = (usage:VisitDataType[],vm_ips:string[]) => {
    //获取hoseusage数据 usage
    //send 格式: {"vm":["172-17-191-254","172-17-191-256"]}
    cnnhist_client.onopen = () =>{
      let ips_json = JSON.stringify(vm_ips);
      let request = `{\"vm\":${ips_json}}`;
      console.log("cnnhisusage open!!!!!!!!");
      cnnhist_client.send(request);
      //console.log(request);
    }
    cnnhist_client.onmessage = cnnhis_message => {
      //console.log(cnnhis_message.data);
      const data = JSON.parse(cnnhis_message.data);
      for(var js in data){
        let str = parseFloat(parseFloat(data[js]).toFixed(2));
        usage.push({
          x: `step ${js}`,
          y: str,
        });
      }
      console.log("---usage---");
      console.log(usage);
      cnnhist_client.close();
    }
    cnnhist_client.onclose = () =>{
      console.log("cnnhisusage connection closed!!!");
    }
  }

  //cpuusagehandler cpuusage
  cpuusageHandler = (cpuusage:number[],cpuusage_max:number,cpuusage_min:number, vm_ips:string[]) => {
    //获取hoseusage数据 usage
    //send 格式: {"vm":["172-17-191-254","172-17-191-256"]}
    cpuusage_client.onopen = () =>{
      let ips_json = JSON.stringify(vm_ips);
      let request = `{\"vm\":${ips_json}}`
      //console.log(request);
      cpuusage_client.send(request);
      console.log("cpuusage open!!!!!!!!");
    }
    cpuusage_client.onmessage = cpu_message => {
      //console.log(cpu_message.data);
      const data = JSON.parse(cpu_message.data);
      let list = [];
      for (let index = 0; index < vm_ips.length; index++) {
        list[index] = data[vm_ips[index]];        
      }
      var obj = getHighLowAverage(list);
      cpuusage.push(obj.A);
      if (cpuusage_max < obj.H)
        cpuusage_max = obj.H;
      if (cpuusage_min > obj.L)
        cpuusage_min = obj.L;
      cpuusage_client.close();
      //window.alert(usage);
    }
    cpuusage_client.onclose = () =>{
      console.log("cpuusage connection closed!!!");
    }
  }
  

  //cnnHandler lossval,top_1_accuracy,top_5_accuracy, jitter
  cnnHandler = (cnn_param:number[], accuracy1:number[], accuracy5:number[], jit:number, vm_ips:string[]) => {
    cnn_client.onopen = () =>{
      let ips_json = JSON.stringify(vm_ips);
      let request = `{\"vm\":${ips_json}}`
      console.log(request);
      console.log("-------cnnopen!!!!!!-----");
      cnn_client.send(request);
      // window.alert(request);
    }
    cnn_client.onmessage = cnn_message => {
      console.log(cnn_message.data);
      console.log("cnnhandler--------------");
      const data = JSON.parse(cnn_message.data);
      let acc1 = [];
      let acc5 = [];
      let list = [];
      for (let index = 0; index < vm_ips.length; index++) {
        list[index] = data[vm_ips[index]]['total_loss'];  
        acc1[index] = data[vm_ips[index]]['top_1_accuracy'];
        acc5[index] = data[vm_ips[index]]['top_5_accuracy'];
        jit = data[vm_ips[index]]['speed_jitter'];        
      }

      //else 测试 记得删！！！！！！！！
      var pre_loss = 1;
      if(cnn_param.length > 0){
        pre_loss = cnn_param[2];
        cnn_param[0] = list[0];
        cnn_param[1] = (pre_loss-cnn_param[0])/pre_loss;
        pre_loss = cnn_param[0];
        cnn_param[2] = pre_loss;
      }
      
      
      var pre_acc1 = 1;
      if(accuracy1.length > 0){
        pre_acc1 = accuracy1[2];
        accuracy1[0] = acc1[0];
        accuracy1[1] = (pre_acc1-accuracy1[0])/pre_acc1;
        pre_loss = accuracy1[0];
        accuracy1[2] = pre_acc1;
      }

      var pre_acc5 = 1;
      if(accuracy5.length > 0){
          pre_acc5 = accuracy5[2];
          accuracy5[0] = acc5[0];
          accuracy5[1] = (pre_acc5-accuracy5[0])/pre_acc5;
          pre_loss = accuracy5[0];
          accuracy5[2] = pre_acc5;
      }
      if(data == null){
        cnn_param = getLossvalData();
        accuracy5 = getAccuracyData();
        accuracy1 = getAccuracyData();
      }
      // window.alert(cnn_param);
      cnn_client.close();
    }
    cnn_client.onclose = () =>{
      console.log("cnn connection closed!!!");
    }
  }

  handleTabChange = (key: string) => {
    console.log(this.state.bwhis[parseInt(key.replace('虚拟机 ',''))]+' is null?');
    this.setState({
      currentTabKey: key,
      offlineChartData: getChartDataFromBw(this.state.bwhis[parseInt(key.replace('虚拟机 ',''))]),
    });
  };

  render() {
    const { currentTabKey, activeData, offlineChartData, cpuusage, lossval, visData, visData2, accuracy1, accuracy5, jitter} = this.state;
    const { dashboardAndanalysis, loading } = this.props;
    //const { visitData } = dashboardAndanalysis;
    const activeKey = currentTabKey || (activeData[0] && activeData[0].name);
    //console.log(currentTabKey);  
    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={visData} visitData2={visData2} cpuusage={cpuusage} lossval={lossval} accuracy={accuracy5} accuracy5={accuracy1} jitter={jitter}/>
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
