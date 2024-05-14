import React from 'react';
import { Tooltip } from 'antd';

type Props = {
  // style?: React.CSSProperties;
  data?: Record<string, any>;
  txt: string;

  id?: string;
  x?: number;
  y?: number;

  svg?: React.SVGAttributes<SVGForeignObjectElement>;
};
const Index = (props: Props) => {
  const { svg = {}, id, x = 0, y = 0, txt } = props;

  return (
    <foreignObject id={id} x={x} y={y} width={100} height={40} {...svg}>
      <Tooltip title={txt}>
        <div
          title={txt}
          style={{
            color: 'blue',
            lineHeight: '40px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          {txt}
        </div>
      </Tooltip>
    </foreignObject>
  );
};

export default Index;
