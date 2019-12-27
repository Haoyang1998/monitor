import {Card, Col, Icon, Row, Tooltip} from 'antd';

import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import { VisitDataType } from '../data.d';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, visitData, visitData2, cpuusage, lossval, accuracy, accuracy5, jitter }: { loading: boolean; visitData: VisitDataType[]; visitData2: VisitDataType[]; cpuusage: number[]; lossval: number[]; accuracy: number[]; accuracy5: number[];jitter: number}) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage id="dashboardandanalysis.analysis.total-sales" defaultMessage="Total Sales" />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage id="dashboardandanalysis.analysis.introduce1" defaultMessage="Introduce" />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={ cpuusage[0] + '%'}
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="down" style={{ marginRight: 16 }}>
              <FormattedMessage id="dashboardandanalysis.analysis.day-sales" defaultMessage="Daily Sales" />
            <span className={styles.trendText}>{cpuusage[2] + "%"}</span>
            </Trend>
            <Trend flag="up">
              <FormattedMessage id="dashboardandanalysis.analysis.day-sales-high" defaultMessage="Daily Sales" />
              <span className={styles.trendText}>{100-cpuusage[1] + "%"}</span>
            </Trend>
          </div>
          // <Field
          //   label={
          //     <FormattedMessage id="dashboardandanalysis.analysis.day-sales" defaultMessage="Daily Sales" />
          //   }
          //   value={`${numeral(12423).format('0,0')}`}
          // />
        }
        contentHeight={64}
      >
        <MiniProgress percent={cpuusage[0]} strokeWidth={8} target={99} color="#13C2C2" />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="dashboardandanalysis.analysis.visits" defaultMessage="Visits" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="dashboardandanalysis.analysis.introduce2" defaultMessage="Introduce" />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={lossval[0]}
        footer={
          // <Field
          //   label={
          //     <FormattedMessage id="dashboardandanalysis.analysis.day-visits" defaultMessage="Daily Visits" />
          //   }
          //   value={lossval[1]}
          // />
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="down" style={{ marginRight: 16 }}>
              <FormattedMessage id="dashboardandanalysis.analysis.day-visits" defaultMessage="Daily Visits" />
            <span className={styles.trendText}>{lossval[1]}%</span>
            </Trend>
          </div>
        }
        contentHeight={64}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="dashboardandanalysis.analysis.payments" defaultMessage="Payments" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="dashboardandanalysis.analysis.introduce3" defaultMessage="Introduce" />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={ visitData2[0].y +" img/sec"}
        footer={
          <Field
            label={
              <FormattedMessage
                id="dashboardandanalysis.analysis.payments-rate"
                defaultMessage="Conversion Rate"
              />
            }
            value={jitter}
          />
        }
        contentHeight={64}
      >
        <MiniBar data={visitData2} />
      </ChartCard>
    </Col>
    
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={
          <FormattedMessage
            id="dashboardandanalysis.analysis.operational-effect"
            defaultMessage="Operational Effect"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage id="dashboardandanalysis.analysis.introduce4" defaultMessage="Introduce" />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={(accuracy[0])+"%"}
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              <FormattedMessage id="dashboardandanalysis.analysis.week" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>{(accuracy[1])+"%"}</span>
            </Trend>
          </div>
        }
        contentHeight={64}
      >
        <MiniProgress targetLabel={"top1acc"} percent={accuracy[0]} strokeWidth={8} target={99} color="#13C2C2" />
        <MiniProgress targetLabel={"top5acc"} percent={accuracy5[0]} strokeWidth={8} target={99} color="#13C252" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
