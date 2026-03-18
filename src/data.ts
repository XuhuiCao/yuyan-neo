import { Session } from './types';

export const initialSessions: Session[] = [
  {
    id: '1',
    title: '首页增加一家渐入动效',
    time: '1 分钟之前',
    status: '待操作',
    added: 303,
    removed: 0,
    appName: 'Neovate Web',
    panoramaState: {
      status: 'ready',
      visibleCards: ['plan', 'code', 'pr', 'deploy', 'ui']
    },
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: '首页增加一家渐入动效',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'step-1',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__analyze_requirements',
        stepDetails: '{\n  "status": "success",\n  "files_analyzed": 12,\n  "dependencies_checked": true\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm2',
        role: 'ai',
        content: '我帮你分析了这个需求并制定了执行计划。',
        timestamp: new Date().toISOString(),
        type: 'plan'
      },
      {
        id: 'step-2',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__modify_files',
        stepDetails: '{\n  "files_modified": [\n    "src/components/HeroSection.tsx",\n    "src/components/AnimatedBorder.tsx"\n  ]\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm3',
        role: 'ai',
        content: '代码修改已完成，为你展示变更详情。',
        timestamp: new Date().toISOString(),
        type: 'code'
      },
      {
        id: 'step-3',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__create_pull_request',
        stepDetails: '{\n  "pr_id": 27,\n  "pr_url": "https://git.example.com/pr/27",\n  "status": "created"\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm4',
        role: 'ai',
        content: '已为你自动创建了合并请求，请查看。',
        timestamp: new Date().toISOString(),
        type: 'pr'
      },
      {
        id: 'step-4',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__trigger_deployment',
        stepDetails: '{\n  "status": "deploying",\n  "env": "production",\n  "job_id": "deploy-8f92a"\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm5',
        role: 'ai',
        content: '部署已完成，产物和 UI 检测已生成，你可以进行预览和验证。',
        timestamp: new Date().toISOString(),
        type: 'deploy'
      }
    ]
  },
  {
    id: '2',
    title: '修复应用部署白屏问题',
    time: '3月6日',
    status: '已完结',
    added: 12,
    removed: 3,
    appName: 'Admin Dashboard',
    panoramaState: {
      status: 'ready',
      visibleCards: ['plan', 'code', 'pr', 'deploy', 'ui']
    },
    messages: [
      {
        id: 'm6',
        role: 'user',
        content: '修复应用部署白屏问题',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'step-5',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__analyze_logs',
        stepDetails: '{\n  "error_found": "Missing environment variable API_URL",\n  "files_checked": 3\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm7',
        role: 'ai',
        content: '我帮你分析了部署日志，发现是因为缺少 `API_URL` 环境变量导致的白屏。',
        timestamp: new Date().toISOString(),
        type: 'plan'
      },
      {
        id: 'step-6',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__modify_files',
        stepDetails: '{\n  "files_modified": [\n    ".env.example",\n    "src/config.ts"\n  ]\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm8',
        role: 'ai',
        content: '代码修改已完成，为你展示变更详情。',
        timestamp: new Date().toISOString(),
        type: 'code'
      },
      {
        id: 'step-7',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__create_pull_request',
        stepDetails: '{\n  "pr_id": 28,\n  "pr_url": "https://git.example.com/pr/28",\n  "status": "created"\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm9',
        role: 'ai',
        content: '已为你自动创建了合并请求，请查看。',
        timestamp: new Date().toISOString(),
        type: 'pr'
      },
      {
        id: 'step-8',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__trigger_deployment',
        stepDetails: '{\n  "status": "deploying",\n  "env": "production",\n  "job_id": "deploy-9a1bc"\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm10',
        role: 'ai',
        content: '部署已完成，产物和 UI 检测已生成，你可以进行预览和验证。',
        timestamp: new Date().toISOString(),
        type: 'deploy'
      }
    ]
  },
  {
    id: '3',
    title: '移除首页多余的英文文案',
    time: '3月2日',
    status: '已完结',
    added: 0,
    removed: 12,
    appName: 'Neovate Web',
    isArchived: true,
    panoramaState: {
      status: 'ready',
      visibleCards: ['plan', 'code', 'pr', 'deploy', 'ui']
    },
    messages: [
      {
        id: 'm11',
        role: 'user',
        content: '移除首页多余的英文文案',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'step-9',
        role: 'ai-step',
        stepType: 'tool',
        stepStatus: 'success',
        content: 'mcp__modify_files',
        stepDetails: '{\n  "files_modified": [\n    "src/components/HeroSection.tsx"\n  ]\n}',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'm12',
        role: 'ai',
        content: '代码修改已完成，为你展示变更详情。',
        timestamp: new Date().toISOString(),
        type: 'code'
      }
    ]
  },
  {
    id: '4',
    title: '优化移动端导航栏间距',
    time: '昨天',
    status: '进行中',
    added: 24,
    removed: 4,
    appName: 'Neovate Web',
    panoramaState: {
      status: 'preparing',
      visibleCards: ['plan']
    },
    messages: []
  },
  {
    id: '5',
    title: '增加用户登录验证逻辑',
    time: '2小时前',
    status: '待操作',
    added: 0,
    removed: 0,
    appName: 'Auth Service',
    panoramaState: {
      status: 'preparing',
      visibleCards: []
    },
    messages: []
  },
  {
    id: '6',
    title: '过时的旧版样式清理',
    time: '2月28日',
    status: '已取消',
    added: 0,
    removed: 156,
    appName: 'Legacy App',
    panoramaState: {
      status: 'ready',
      visibleCards: ['code']
    },
    messages: []
  }
];

// Generate mock data for simulation
const appNames = ['Neovate Web', 'Admin Dashboard', 'Auth Service', 'Legacy App', '未分组'];
const statuses = ['进行中', '已完结', '待操作', '已取消', '有异常'];

for (let i = 7; i <= 50; i++) {
  initialSessions.push({
    id: `${i}`,
    title: `模拟对话任务测试 ${i}`,
    time: `3月${Math.floor(Math.random() * 30 + 1)}日`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    added: Math.floor(Math.random() * 100),
    removed: Math.floor(Math.random() * 50),
    appName: appNames[Math.floor(Math.random() * appNames.length)],
    isArchived: Math.random() > 0.8,
    panoramaState: {
      status: 'ready',
      visibleCards: ['plan']
    },
    messages: []
  });
}
