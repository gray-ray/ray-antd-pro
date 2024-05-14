type Props = {
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
  color?: string;
};
const Index = (props: Props) => {
  const { startX, startY, controlX, controlY, endX, endY, color = '#999' } = props;

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
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};
export default Index;
