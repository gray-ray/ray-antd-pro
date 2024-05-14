type Props = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  arrowSize?: number;
  color?: string;
};
const Index = (props: Props) => {
  const { startX, startY, endX, endY, color = '#999' } = props;

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

      {/* 直线 */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        fill="none"
        stroke={color}
        strokeWidth="1"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};
export default Index;
