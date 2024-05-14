import React from 'react';
import styles from './index.less';
import { StatusColorMp, NodeStatus } from './enum';

type Props = {
  style?: React.CSSProperties;
  data?: RAY_API.ProjectPlanVersionCycleStage &
    RAY_API.ProjectPlanVersionCycleCompileStage;

  txt: string;
  x?: number;
  y?: number;
  [prop: string]: any;
};
const Index = (props: Props) => {
  const { style = {}, width = 90, height = 60, x = 0, y = 0, txt, data } = props;

  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div className={styles.statusWrap}>
        <div className={styles.statusIco} style={{ background: StatusColorMp[data?.status] }} />
        <div className={styles.statusTxt}>{txt}</div>
        {data?.startTime && (
          <div
            className={styles.extra}
            title={`${data?.startTime}${data?.endTime ? '~' : ''}${data?.endTime || ''}`}
          >{`${data?.startTime}${data?.endTime ? '~' : ''}${data?.endTime || ''}`}</div>
        )}
        {data?.version && (
          <div className={styles.extra} title={data?.version}>
            {data?.version}
          </div>
        )}
      </div>
    </foreignObject>
  );
};

export default Index;
