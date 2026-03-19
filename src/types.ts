export interface Message {
  id: string;
  role: 'user' | 'ai' | 'ai-step';
  content: string;
  timestamp: string;
  type?: PanoramaCardType | 'app-selection' | 'iteration-selection' | 'ui-confirm' | 'release-confirm';
  stepType?: 'think' | 'tool';
  stepStatus?: 'pending' | 'success';
  stepDetails?: string;
}

export type PanoramaCardType = 'plan' | 'code' | 'pr' | 'build' | 'deploy' | 'ui' | 'doc' | 'release' | 'promote';

export interface PlanItem {
  id: string;
  text: string;
  subtext?: string;
  status: 'pending' | 'completed';
}

export interface CodeChange {
  name: string;
  path: string;
  status: 'A' | 'M' | 'D';
}

export interface PRDetails {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  sourceBranch: string;
  targetBranch: string;
  summary: string;
}

export interface BuildArtifact {
  name: string;
  url: string;
  size: string;
}

export interface DeployArtifact {
  type: string;
  url: string;
  count: number;
}

export interface ReleasePlan {
  id: string;
  title: string;
  env: string;
  version: string;
  items: string[];
  yuyanUrl: string;
}

export interface PanoramaData {
  planStatus?: 'loading' | 'success';
  plan?: PlanItem[];
  docStatus?: 'loading' | 'success';
  doc?: {
    title: string;
    content: string;
    supplementaryData?: {
      apiChanges?: { method: string; path: string; description: string }[];
      dbChanges?: { table: string; action: string; description: string }[];
      dependencies?: { name: string; version: string; action: string }[];
    };
  };
  codeStatus?: 'loading' | 'success';
  code?: {
    added: number;
    removed: number;
    files: CodeChange[];
  };
  prStatus?: 'pending' | 'loading' | 'success' | 'merged';
  pr?: PRDetails;
  buildStatus?: 'loading' | 'success';
  build?: {
    duration: string;
    artifacts: BuildArtifact[];
  };
  deployStatus?: 'loading' | 'success';
  deploy?: DeployArtifact[];
  uiStatus?: 'loading' | 'success';
  releaseStatus?: 'loading' | 'success';
  release?: ReleasePlan;
}

export interface Session {
  id: string;
  title: string;
  time: string;
  status: '进行中' | '已完结' | '已取消' | '待操作' | '有异常';
  added: number;
  removed: number;
  appName?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  location?: 'cloud' | 'local';
  messages: Message[];
  panoramaState: {
    status: 'preparing' | 'ready';
    visibleCards: PanoramaCardType[];
    data?: PanoramaData;
  };
}
