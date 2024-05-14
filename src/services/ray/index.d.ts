declare namespace RAY_API {
  type ProjectPlanVersionCycle = {
    pSVPlanId: number;
    cooldevProjectId: number;
    projectSureStageId: number;
    planVersion: string;
    planStageList: ProjectPlanVersionCycleStage[];
    planCompileList: ProjectPlanVersionCycleCompile[];
    psvplanId: number;
  };

  type ProjectPlanVersionCycleStage = {
    stageName: string;
    sort: 0;
    status: string;
    startTime: string;
    endTime: string;
  };

  type ProjectPlanVersionCycleCompile = {
    version: string;
    stageList: ProjectPlanVersionCycleCompileStage[];
  };

  type ProjectPlanVersionCycleCompileStage = {
    id: number;
    stageKey: string;
    stageName: string;
    sort: number;
    status: string;
    version?: string; // 前端渲染使用
  };
}
