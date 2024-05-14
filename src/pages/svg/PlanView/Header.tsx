import React from 'react';
import styles from './index.less';
import { StatusColorMp, NodeStatus } from './enum';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type Props = {
  style?: React.CSSProperties;
  showVersion: boolean;

  x?: number;
  y?: number;
  [prop: string]: any;
};
const Index = (props: Props) => {
  const { style = {}, width = 90, height = 40, x = 0, y = 0, showVersion } = props;

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'key1',
      title: '项目阶段',
      width: 180,
    },
    {
      dataIndex: 'key2',
      title: '版本计划',
      width: 170,
    },
    {
      dataIndex: 'key3',
      title: '版本生命周期',
    },
  ];

  return (
    <foreignObject x={x} y={y} width={'100%'} height={height}>
      <Table
        size="small"
        columns={showVersion ? columns : columns?.slice(1)}
        components={{ body: { wrapper: () => <></> } }}
      />
    </foreignObject>
  );
};

export default Index;
