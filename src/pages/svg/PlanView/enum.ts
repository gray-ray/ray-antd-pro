export enum NodeStatus {
  未开始 = 'NotStart',
  进行中 = 'Ongoing',
  成功 = 'Pass',
  失败 = 'Fail',
}

export const StatusColorMp = {
  [NodeStatus.未开始]: '#979797',
  [NodeStatus.进行中]: '#1890FF',
  [NodeStatus.成功]: '#52C41A',
  [NodeStatus.失败]: '#E10D0D',
};
