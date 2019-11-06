import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function realtimedata(params : any) {
  return request(`http://cpu14.maas:5566/chart/${params}`);
}
