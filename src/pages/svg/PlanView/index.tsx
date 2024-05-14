import { useRef } from 'react';
import TextNode from './TextNode';
import StatusNode from './StatusNode';
import CubicBezier from './CubicBezier';
import QuadBezier from './QuadBezier';
import Line from './Line';
import useModel from './useModel';
import Header from './Header';

const Index = () => {
  const {
    heightMap,
    ViewTop,
    stageMap,
    getCompileMap,
    getQuadBezierLines,
    dataSource,
    getViewHeight,
    cubicBezierArr,
    versionSvgArr,
    stageNode,
    versionSvgX,
    showStage,
  } = useModel();
  const containerRef = useRef(null);

  return (
    <div style={{ overflow: 'hidden' }}>
      <div id="container" style={{ width: '100%', overflow: 'auto' }} ref={containerRef}>
        <svg
          width={'100%'}
          style={{ minWidth: 1560 - 230 }}
          height={getViewHeight}
          xmlns="http://www.w3.org/2000/svg"
        >
          <Header showVersion={showStage} />
          {showStage && (
            <>
              <TextNode txt={`版本号`} {...stageNode} />

              {dataSource?.length > 1 &&
                dataSource?.map((o, i) => (
                  <CubicBezier key={o?.pSVPlanId} {...cubicBezierArr[i]} />
                ))}

              {dataSource?.length == 1 && (
                <Line
                  startX={stageNode?.x + stageNode?.width}
                  startY={heightMap.textHeight / 2 + ViewTop}
                  endX={versionSvgX}
                  endY={heightMap.textHeight / 2 + ViewTop}
                />
              )}
            </>
          )}

          {/* 计划版本 */}
          {dataSource?.map((o, gapIndex) => (
            <svg
              y={versionSvgArr[gapIndex]?.y + 30}
              x={versionSvgArr[gapIndex]?.x}
              width={versionSvgArr[gapIndex]?.width}
              height={versionSvgArr[gapIndex]?.height}
              key={o?.pSVPlanId}
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="100%" height="70" fill="#E6F7FF" />
              <TextNode
                x={stageMap?.get('version')?.x}
                y={ViewTop}
                txt={o?.planVersion}
                svg={{ width: stageMap?.get('version')?.width }}
              />
              <Line
                startX={stageMap?.get('version')?.x + stageMap?.get('version')?.width}
                startY={heightMap.nodeHeight / 2}
                endX={
                  stageMap?.get('version')?.x +
                  stageMap?.get('version')?.width +
                  stageMap?.get('version')?.nextGap
                }
                endY={heightMap.nodeHeight / 2}
              />

              {o?.planStageList?.map((s) => {
                const config = stageMap.get(s?.stageName);
                return (
                  <g key={s?.stageName}>
                    <StatusNode
                      x={config?.x}
                      y={config?.y}
                      width={config?.width}
                      height={config?.height}
                      data={s}
                      txt={s?.stageName}
                    />

                    {config?.next && (
                      <Line
                        startX={config.width + config?.x}
                        startY={heightMap.nodeHeight / 2}
                        endX={config.width + config?.x + config.nextGap}
                        endY={heightMap.nodeHeight / 2}
                      />
                    )}

                    {/* 编译连接线  NOTE: 编译固定在集成下面 */}
                    {s?.stageName === '集成' &&
                      o?.planCompileList?.map((c, cIndex) => {
                        const info = getQuadBezierLines(cIndex);
                        return (
                          <QuadBezier
                            key={c?.version}
                            startX={info?.startX}
                            startY={info?.startY}
                            controlX={info?.controlX}
                            controlY={info?.controlY}
                            endX={info?.endX}
                            endY={info?.endY}
                          />
                        );
                      })}
                  </g>
                );
              })}

              {o?.planCompileList?.map((s, index) => {
                return (
                  <g key={s?.version}>
                    {s?.stageList?.map((o, sIndex) => {
                      const compileMap = getCompileMap(
                        [
                          { tar: '转测评估', pre: '集成', next: '系统测试' },
                          { tar: '系统测试', pre: '转测评估', next: undefined },
                          // { tar: '系统测试', pre: '转测评估', next: '内部发布' },
                          // { tar: '内部发布', pre: '系统测试', next: '外部发布' },
                          // { tar: '外部发布', pre: '内部发布', next: undefined },
                        ],
                        index,
                      );
                      return (
                        <g key={o?.stageName}>
                          <StatusNode
                            x={compileMap?.get(o?.stageName)?.x}
                            y={compileMap?.get(o?.stageName)?.y}
                            parent={o}
                            data={{ ...s, version: o?.version }}
                            width={compileMap?.get(o?.stageName)?.width}
                            txt={o?.stageName}
                          />
                          {compileMap?.get(o?.stageName)?.nextGap > 0 &&
                            s?.stageList[sIndex + 1] && (
                              <Line
                                startX={
                                  compileMap?.get(o?.stageName)?.x +
                                  compileMap?.get(o?.stageName)?.width
                                }
                                startY={heightMap.nodeHeight + ViewTop + 40 + index * 60}
                                endX={
                                  compileMap?.get(o?.stageName)?.x +
                                  compileMap?.get(o?.stageName)?.width +
                                  compileMap?.get(o?.stageName)?.nextGap
                                }
                                endY={heightMap.nodeHeight + ViewTop + 40 + index * 60}
                              />
                            )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Index;
