import { useRef, useEffect, useState, useMemo } from 'react';
import { versionLifeCycle } from '@/services/devops/software';
import { mockData } from './data';

export type ConfigProps = {
  width: number | string;
  height: number;
  nextGap: number;
  x: number;
  y: number;
  next?: string | undefined;
  leftPoint?: { x: number; y: number }; // 左侧连接点
  rightPoint?: { x: number; y: number }; // 右侧侧连接点
};

type CubicPoint = {
  startX: number;
  startY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  endX: number;
  endY: number;
};

const HeaderTop = 30;

const ViewTop = 10; // svg中视图顶层初始y

const gapMap = {
  versionGap: 20, // 每一个版本计划间隔

  version: 70,
  开发: 70,
  集成: 70,
  版本验证: 0, // 90,
  版本发布: 0, // 90,

  编译集成: 70,
  转测评估: 50,
  系统测试: 0, // 50,
  内部发布: 0, // 90,
  外部发布: 0,
};

const heightMap = {
  nodeHeight: 60,
  textHeight: 40,
};

const widthMap = {
  stage: 100,
  version: 100,
  开发: 200,
  集成: 200,
  版本发布: 200,
  版本验证: 430,
  编译集成: 150,
  转测评估: 110,
  系统测试: 110,
  内部发布: 110,
  外部发布: 200,
};

const useModel = () => {
  const [dataSource, setDataSource] = useState<RAY_API.ProjectPlanVersionCycle[]>(mockData);

  const showStage = true;

  // NOTE: 判断是否展示阶段column， 版本计划 svg x 起始位置
  const versionSvgX = 190;

  /** 阶段 节点信息 */
  const [stageNode, setStageNode] = useState<Omit<ConfigProps, 'nextGap'>>();

  /** 计划版本 节点信息数组 */
  const [versionSvgArr, setVersionSvgArr] = useState<Omit<ConfigProps, 'nextGap'>[]>([]);

  /** 版本步骤 */
  const getStageMap = (
    linksArr: { tar: string; pre: string; next: string | undefined }[],
  ): Map<string, ConfigProps> => {
    const mp: Map<string, ConfigProps> = new Map([
      [
        'version',
        {
          width: widthMap.version,
          height: heightMap.textHeight,
          nextGap: gapMap.version,
          x: 0,
          y: ViewTop,
          next: '开发',
          target: 'version',
          leftPoint: { x: 0, y: ViewTop + heightMap.textHeight / 2 },
          rightPoint: { x: widthMap.version, y: ViewTop + heightMap.textHeight / 2 },
        },
      ],
    ]);
    for (let i = 0; i < linksArr?.length; i++) {
      const { tar, pre, next } = linksArr[i];
      const preInfo = mp?.get(pre);
      const obj = {
        width: widthMap[tar],
        height: heightMap.nodeHeight,
        nextGap: gapMap[tar],
        x: preInfo?.width + preInfo?.nextGap + preInfo?.x,
        y: ViewTop,
        pre: pre,
        tar,
        next,
        leftPoint: { x: preInfo?.width + preInfo?.x, y: ViewTop + heightMap.textHeight / 2 },
        rightPoint: {
          x: preInfo?.width + preInfo?.nextGap + preInfo?.x,
          y: ViewTop + heightMap.textHeight / 2,
        },
      };
      mp.set(tar, obj);
    }
    return mp;
  };

  const stageMap = getStageMap([
    { tar: '开发', pre: 'version', next: '集成' },
    { tar: '集成', pre: '开发', next: '版本验证' },
    // { tar: '版本验证', pre: '集成', next: '版本发布' },
    { tar: '版本验证', pre: '集成', next: undefined },
    // { tar: '版本发布', pre: '版本验证', next: undefined },
  ]);

  /**编译步骤 */
  const getCompileMap = (
    linksArr: { tar: string; pre: string; next: string | undefined }[],
    index: number,
  ): Map<string, ConfigProps> => {
    const stage = stageMap.get('集成');
    const stageDis = heightMap.nodeHeight + ViewTop + 20;
    const mp: Map<string, ConfigProps> = new Map([
      [
        '集成',
        {
          width: widthMap.编译集成,
          height: heightMap.nodeHeight,
          nextGap: gapMap.编译集成,
          x: (stage?.x || 0) + 50,
          y: stageDis + heightMap.nodeHeight * index, // stageNode  60 + viewTop 10 + heightMap.textHeight 20
          next: '转测评估',
        },
      ],
    ]);

    for (let i = 0; i < linksArr?.length; i++) {
      const { tar, pre, next } = linksArr[i];
      const { width, nextGap, x } = mp?.get(pre);
      const obj = {
        width: widthMap[tar],
        height: heightMap.nodeHeight,
        nextGap: gapMap[tar],
        x: width + nextGap + x,
        y: stageDis + heightMap.nodeHeight * index,
        pre: pre,
        next,
      };
      mp.set(tar, obj);
    }
    return mp;
  };

  /** 二次贝塞尔曲线 需要调整 */
  const getQuadBezierLines = (i: number) => {
    const { x = 0, height = 0 } = stageMap?.get('集成') ?? {};

    const pointYDis = 20 + 20 + 20;

    const startX = x + 30;

    const startY = height - 10;

    return {
      startX,
      startY,

      endX: startX + 20,
      endY: startY + pointYDis * (i + 1),

      controlX: startX,
      controlY: startY + pointYDis * (i + 1),
    };
  };

  /** 三次贝塞尔曲线 */
  const cubicBezierArr = useMemo(() => {
    const final: CubicPoint[] = [];
    if (!stageNode) return [];
    versionSvgArr?.forEach((point2) => {
      const point1 = stageNode;
      const { x: x2, y: y2 } = point2?.leftPoint;
      const { x: x1, y: y1 } = point1?.rightPoint;
      const obj: CubicPoint = {
        startX: x1,
        startY: y1,

        controlX1: x2 + 10,
        controlY1: y1,

        controlX2: x1 + 10,
        controlY2: y2 + HeaderTop,

        endX: x2,
        endY: y2 + HeaderTop,
      };
      final?.push(obj);
    });

    return final;
  }, [stageNode, versionSvgArr]);

  // 获取计划版本的svg高度
  const getVersionHeight = (x: number) => {
    // 20 为 集成与下面的编译集成node 之间的间隔
    return x * 60 + gapMap.versionGap + heightMap.nodeHeight + 20;
  };

  /** 获取 每个计划版本 {x, y, width, height } */
  const getVersionSvgArr = (x: number) => {
    const versionHeightArr = dataSource?.map((p) => getVersionHeight(p?.planCompileList?.length));

    const final: Omit<ConfigProps, 'nextGap'>[] = [];

    dataSource?.forEach((o, index) => {
      const curStageDis = getVersionHeight(o?.planCompileList?.length);

      let y = ViewTop;

      if (index > 0) {
        const copy = versionHeightArr?.slice(0, index);

        const dis = copy?.reduce((pre, c) => pre + c, 0);

        y = dis;
      }

      const obj: Omit<ConfigProps, 'nextGap'> = {
        y,
        x,
        width: '100%',
        height: curStageDis,
        leftPoint: { x: x - 10, y: y + 30 },
      };

      final?.push(obj);
    });
    setVersionSvgArr(final);
  };

  /** 获取视图高度 */
  const getViewHeight = useMemo(() => {
    let viewH = ViewTop + HeaderTop;

    for (let i = 0, len = dataSource?.length; i < len; i++) {
      viewH += getVersionHeight(dataSource[i]?.planCompileList?.length);
    }
    return viewH;
  }, [dataSource]);

  /** 根据视图高度获取 阶段坐标相关信息 */
  const projectStageXY = (last: Omit<ConfigProps, 'nextGap'>) => {
    if (dataSource?.length <= 1) {
      setStageNode({
        x: 10,
        y: ViewTop + HeaderTop,
        width: widthMap?.stage,
        height: heightMap.textHeight,
        rightPoint: { x: 10 + widthMap.stage, y: heightMap.textHeight / 2 },
      });

      return;
    }

    setStageNode({
      y: (last?.y + ViewTop + HeaderTop) / 2,
      rightPoint: {
        x: 10 + widthMap.stage,
        y: (last?.y + ViewTop + HeaderTop) / 2 + heightMap.textHeight / 2,
      },
      x: 10,
      width: widthMap?.stage,
      height: heightMap.textHeight,
    });
  };

  useEffect(() => {
    if (versionSvgArr?.length === 0) return;
    projectStageXY(versionSvgArr?.concat()?.pop());
  }, [versionSvgArr]);

  useEffect(() => {
    getVersionSvgArr(versionSvgX);
  }, [dataSource, versionSvgX]);

  return {
    gapMap,
    heightMap,
    widthMap,
    ViewTop,
    stageMap,
    getCompileMap,
    getQuadBezierLines,
    dataSource,

    getViewHeight,
    showStage,
    versionSvgArr,
    projectStageXY,
    stageNode,
    cubicBezierArr,
    versionSvgX,

    HeaderTop,
  };
};
export default useModel;
