import React from 'react';

type Props = {
  startX: number;
  startY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  endX: number;
  endY: number;
  arrowSize?: number;
  color?: string;
};
const Index = (props: Props) => {
  const {
    startX,
    startY,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
    color = '#999',
  } = props;

  return (
    <g>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 16 16"
          refX="8"
          refY="8"
          fill={color}
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" />
        </marker>
      </defs>
      {/* 贝塞尔曲线 */}
      <path
        d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2}, ${controlY2} ${endX},${endY}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};
export default Index;
