import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import DetailsPanel from './components/DetailsPanel';
import PanoramaPanel from './components/PanoramaPanel';
import EmptyChat from './components/EmptyChat';
import { Session, Message, PanoramaCardType, PanoramaData } from './types';
import { initialSessions } from './data';
import { AppIteration } from './components/AppIterationModal';

function generateSimulationData(message: string): PanoramaData {
  const isBug = message.includes('修复') || message.includes('bug') || message.includes('缺陷');
  const isStyle = message.includes('样式') || message.includes('颜色') || message.includes('UI');
  
  const plan = [
    { id: 'p1', text: '分析需求与上下文', status: 'pending' as const },
    { id: 'p2', text: isBug ? '定位问题代码' : '设计技术方案', status: 'pending' as const },
    { id: 'p3', text: isBug ? '修复代码逻辑' : '实现功能代码', status: 'pending' as const },
    { id: 'p4', text: '运行本地测试', status: 'pending' as const },
    { id: 'p5', text: '提交合并请求', status: 'pending' as const },
  ];

  const doc = {
    title: isBug ? '缺陷修复方案' : '功能实现方案',
    content: `## 需求分析\n\n${message}\n\n## 技术方案\n\n1. **核心逻辑**：\n   - ${isBug ? '定位并修复缺陷' : '实现新功能模块'}\n   - 确保代码兼容性\n\n2. **涉及文件**：\n   - \`src/App.tsx\`\n   - \`src/components/...\`\n\n3. **测试验证**：\n   - 编写单元测试\n   - 运行本地预览\n\n## 风险评估\n\n- 暂无明显风险。`,
    supplementaryData: {
      apiChanges: isStyle ? undefined : [
        { method: 'GET', path: '/api/v1/user/profile', description: '新增返回字段 `preferences`' },
        { method: 'POST', path: '/api/v1/settings/update', description: '支持批量更新配置' }
      ],
      dbChanges: isBug ? undefined : [
        { table: 'user_settings', action: 'ALTER', description: '新增列 `theme_mode` VARCHAR(20)' }
      ],
      dependencies: [
        { name: 'lucide-react', version: '^0.263.1', action: 'UPDATE' },
        { name: 'clsx', version: '^2.0.0', action: 'ADD' }
      ]
    }
  };

  const code = {
    added: isBug ? 12 : (isStyle ? 45 : 128),
    removed: isBug ? 8 : (isStyle ? 12 : 24),
    files: [
      { name: isStyle ? 'index.css' : 'App.tsx', path: 'src', status: 'M' as const },
      { name: isStyle ? 'HeroSection.tsx' : 'utils.ts', path: 'src/components', status: 'M' as const },
      ...(!isBug && !isStyle ? [{ name: 'NewFeature.tsx', path: 'src/components', status: 'A' as const }] : [])
    ]
  };

  const pr = {
    id: Math.floor(Math.random() * 100) + 100,
    title: `${isBug ? 'fix' : 'feat'}: ${message.split('\n')[0].substring(0, 20)}`,
    author: 'AI Assistant',
    createdAt: '刚刚',
    sourceBranch: `feature/ai-${Date.now().toString().slice(-6)}`,
    targetBranch: 'main',
    summary: `根据需求自动生成的代码变更。\n\n主要修改点：\n- ${isBug ? '修复了相关缺陷' : '实现了核心逻辑'}\n- 更新了相关组件`
  };

  const deploy = [
    { type: '在线页面', url: `https://render.example.com/preview/${Date.now().toString().slice(-6)}/index.html`, count: 4 },
    { type: '静态资源', url: `https://cdn.example.com/assets/${Date.now().toString().slice(-6)}.js`, count: 12 },
  ];

  return { plan, doc, code, pr, deploy };
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [openDetailsTabs, setOpenDetailsTabs] = useState<PanoramaCardType[]>([]);
  const [activeDetailsTab, setActiveDetailsTab] = useState<PanoramaCardType | null>(null);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [renameSession, setRenameSession] = useState<{id: string, title: string} | null>(null);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    if (currentSessionId !== lastSessionId) {
      setLastSessionId(currentSessionId);
      setIsPanoramaOpen(currentSession?.panoramaState.visibleCards.length ? true : false);
    }
  }, [currentSessionId, currentSession, lastSessionId]);

  useEffect(() => {
    if (currentSession?.panoramaState.visibleCards.length) {
      setIsPanoramaOpen(true);
    }
  }, [currentSession?.panoramaState.visibleCards.length]);

  const handleNewSession = (message: string, selectedApp: AppIteration | null) => {
    const simData = generateSimulationData(message);
    const appName = selectedApp ? (selectedApp.type === 'app' ? selectedApp.name : selectedApp.parentApp) : undefined;
    
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: message.substring(0, 20) + (message.length > 20 ? '...' : ''),
      time: '刚刚',
      status: '进行中',
      added: 0,
      removed: 0,
      isArchived: false,
      appName: appName,
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'env-prep',
          role: 'ai-step',
          stepType: 'tool',
          stepStatus: 'pending',
          content: '环境准备',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'step-1',
          role: 'ai-step',
          stepType: 'think',
          stepStatus: 'pending',
          content: '思考中',
          timestamp: new Date().toISOString(),
        }
      ],
      panoramaState: {
        status: 'preparing',
        visibleCards: []
      }
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setOpenDetailsTabs([]);
    setActiveDetailsTab(null);

    // Simulation steps
    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== newSession.id) return s;
        const msgs = s.messages.map(m => m.id === 'env-prep' ? { ...m, stepStatus: 'success' as const } : m);
        return { 
          ...s, 
          messages: msgs,
          panoramaState: { ...s.panoramaState, status: 'ready' }
        };
      }));
    }, 1000);

    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== newSession.id) return s;
        const msgs = s.messages.map(m => m.id === 'step-1' ? { ...m, stepStatus: 'success' as const } : m);
        
        let aiResponse = '';
        let msgType: 'app-selection' | 'iteration-selection' | undefined = undefined;
        if (!selectedApp) {
          aiResponse = '为了更好地执行任务，请先确认你要操作的**应用**，并选择或新建一个**迭代**。';
          msgType = 'app-selection';
        } else if (selectedApp.type === 'app') {
          aiResponse = `你已选择应用 **${selectedApp.name}**。接下来，请选择或新建一个**迭代**以便我们开始工作。`;
          msgType = 'iteration-selection';
        } else {
          aiResponse = `你已选择迭代 **${selectedApp.name}**。我已经基于该迭代拉出了研发分支，我们现在可以开始执行任务了。`;
        }

        const nextMessages: Message[] = [
          ...msgs,
          { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__analyze_requirements', stepDetails: '{\n  "status": "success",\n  "files_analyzed": 12,\n  "dependencies_checked": true\n}', timestamp: new Date().toISOString() },
          { 
            id: crypto.randomUUID(), 
            role: 'ai', 
            content: aiResponse, 
            timestamp: new Date().toISOString(),
            type: msgType
          }
        ];

        if (selectedApp?.type === 'iteration') {
          nextMessages.push(
            { 
              id: crypto.randomUUID(), 
              role: 'ai', 
              content: '我帮你分析了这个需求并制定了执行计划。', 
              timestamp: new Date().toISOString(),
              type: 'plan'
            },
            { id: 'step-2', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
          );
        }

        const updatedPlan = simData.plan?.map(p => ['p1'].includes(p.id) ? { ...p, status: 'completed' as const } : p);

        return {
          ...s,
          messages: nextMessages,
          panoramaState: selectedApp?.type === 'iteration' 
            ? { ...s.panoramaState, visibleCards: ['plan'], data: { ...s.panoramaState.data, plan: updatedPlan, doc: simData.doc } }
            : s.panoramaState
        };
      }));
    }, 1500);

    if (selectedApp?.type === 'iteration') {
      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === 'step-2' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__search_codebase', stepDetails: '{\n  "files_found": 3,\n  "matches": 12\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '我已经为你产出了技术方案文档，请查看。', 
                timestamp: new Date().toISOString(),
                type: 'doc'
              },
              { id: 'step-3', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, visibleCards: [...s.panoramaState.visibleCards, 'doc'], data: { ...s.panoramaState.data, plan: updatedPlan } }
          };
        }));
      }, 3500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === 'step-3' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            added: simData.code?.added || 0,
            removed: simData.code?.removed || 0,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__modify_files', stepDetails: '{\n  "files_modified": [\n    "src/components/HeroSection.tsx",\n    "src/components/AnimatedBorder.tsx"\n  ]\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '代码修改已完成，为你展示变更详情。', 
                timestamp: new Date().toISOString(),
                type: 'code'
              },
              { id: 'step-4', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, visibleCards: [...s.panoramaState.visibleCards, 'code'], data: { ...s.panoramaState.data, plan: updatedPlan, code: simData.code } }
          };
        }));
      }, 5500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === 'step-4' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__run_tests', stepDetails: '{\n  "tests_passed": 24,\n  "tests_failed": 0,\n  "coverage": "89%"\n}', timestamp: new Date().toISOString() },
              { id: 'step-5', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, data: { ...s.panoramaState.data, plan: updatedPlan } }
          };
        }));
      }, 7500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === 'step-5' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4', 'p5'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__create_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "pr_url": "https://git.example.com/pr/27",\n  "status": "created"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '由 NeoSwift 自动创建', 
                timestamp: new Date().toISOString(),
                type: 'pr'
              },
              { id: 'step-6', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, visibleCards: [...s.panoramaState.visibleCards, 'pr'], data: { ...s.panoramaState.data, plan: updatedPlan, pr: simData.pr } }
          };
        }));
      }, 9500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === 'step-6' ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_deployment', stepDetails: '{\n  "status": "deploying",\n  "env": "production",\n  "job_id": "deploy-8f92a"\n}', timestamp: new Date().toISOString() },
              { id: 'step-7', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ]
          };
        }));
      }, 11500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === 'step-7' ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            status: '待操作',
            messages: [
              ...msgs,
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '部署已完成，产物和 UI 检测已生成，你可以进行预览和验证。', 
                timestamp: new Date().toISOString(),
                type: 'deploy'
              }
            ],
            panoramaState: { status: 'ready', visibleCards: [...s.panoramaState.visibleCards, 'deploy', 'ui'], data: { ...s.panoramaState.data, deploy: simData.deploy } }
          };
        }));
      }, 13500);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!currentSessionId) return;

    const stepId = crypto.randomUUID();
    const isAppSelected = message.includes('目标上下文：应用');
    const isIterationSelected = message.includes('目标上下文：迭代');
    
    const appMatch = message.match(/目标上下文：应用 - (.*)/);
    const parentAppMatch = message.match(/所属应用：(.*)/);
    const appName = appMatch ? appMatch[1].split('\n')[0] : (parentAppMatch ? parentAppMatch[1].split('\n')[0] : '');
    
    const simData = generateSimulationData(message);

    setSessions(prevSessions => prevSessions.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              role: 'user',
              content: message,
              timestamp: new Date().toISOString(),
            },
            {
              id: stepId,
              role: 'ai-step',
              stepType: 'think',
              stepStatus: 'pending',
              content: '思考中',
              timestamp: new Date().toISOString(),
            }
          ]
        };
      }
      return s;
    }));

    // Simulate AI response
    setTimeout(() => {
      setSessions(prevSessions => prevSessions.map(s => {
        if (s.id === currentSessionId) {
          const msgs = s.messages.map(m => m.id === stepId ? { ...m, stepStatus: 'success' as const } : m);
          
          let aiResponse = '';
          let msgType: 'app-selection' | 'iteration-selection' | undefined = undefined;

          if (isIterationSelected) {
            aiResponse = `好的，我已经基于你选择的迭代拉出了研发分支，现在开始执行任务。`;
          } else if (isAppSelected) {
            aiResponse = `你已选择应用 **${appName}**。接下来，请选择或新建一个**迭代**以便我们开始工作。`;
            msgType = 'iteration-selection';
          } else {
            aiResponse = `好的，关于“**${message.split('\n')[0]}**”，我已经了解了。为了更好地执行任务，请先确认你要操作的**应用**，并选择或新建一个**迭代**。`;
            msgType = 'app-selection';
          }

          const nextMessages: Message[] = [
            ...msgs,
            { 
              id: crypto.randomUUID(), 
              role: 'ai-step', 
              stepType: 'tool', 
              stepStatus: 'success', 
              content: 'mcp__analyze_context', 
              stepDetails: '{\n  "context_loaded": true,\n  "tokens": 1204\n}', 
              timestamp: new Date().toISOString() 
            },
            {
              id: crypto.randomUUID(),
              role: 'ai',
              content: aiResponse,
              timestamp: new Date().toISOString(),
              type: msgType
            }
          ];

          if (isIterationSelected) {
            nextMessages.push(
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '我帮你分析了这个需求并制定了执行计划。', 
                timestamp: new Date().toISOString(),
                type: 'plan'
              },
              { id: 'step-2-chat', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            );
          }

          const updatedPlan = simData.plan?.map(p => ['p1'].includes(p.id) ? { ...p, status: 'completed' as const } : p);

          return {
            ...s,
            appName: appName || s.appName,
            messages: nextMessages,
            panoramaState: isIterationSelected
              ? { ...s.panoramaState, visibleCards: ['plan'], data: { ...s.panoramaState.data, plan: updatedPlan } }
              : s.panoramaState
          };
        }
        return s;
      }));
    }, 1500);

    if (isIterationSelected) {
      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === 'step-2-chat' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__search_codebase', stepDetails: '{\n  "files_found": 3,\n  "matches": 12\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '我已经为你产出了技术方案文档，请查看。', 
                timestamp: new Date().toISOString(),
                type: 'doc'
              },
              { id: 'step-3-chat', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, visibleCards: [...s.panoramaState.visibleCards, 'doc'], data: { ...s.panoramaState.data, plan: updatedPlan } }
          };
        }));
      }, 3500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === 'step-3-chat' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            added: simData.code.added,
            removed: simData.code.removed,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__modify_files', stepDetails: '{\n  "files_modified": [\n    "src/components/HeroSection.tsx",\n    "src/components/AnimatedBorder.tsx"\n  ]\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '代码修改已完成，为你展示变更详情。', 
                timestamp: new Date().toISOString(),
                type: 'code'
              },
              { id: 'step-4-chat', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, visibleCards: [...s.panoramaState.visibleCards, 'code'], data: { ...s.panoramaState.data, plan: updatedPlan, code: simData.code } }
          };
        }));
      }, 5500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === 'step-4-chat' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__run_tests', stepDetails: '{\n  "tests_passed": 24,\n  "tests_failed": 0,\n  "coverage": "89%"\n}', timestamp: new Date().toISOString() },
              { id: 'step-5-chat', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, data: { ...s.panoramaState.data, plan: updatedPlan } }
          };
        }));
      }, 7500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === 'step-5-chat' ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4', 'p5'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__create_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "pr_url": "https://git.example.com/pr/27",\n  "status": "created"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '由 NeoSwift 自动创建', 
                timestamp: new Date().toISOString(),
                type: 'pr'
              },
              { id: 'step-6-chat', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { ...s.panoramaState, visibleCards: [...s.panoramaState.visibleCards, 'pr'], data: { ...s.panoramaState.data, plan: updatedPlan, pr: simData.pr } }
          };
        }));
      }, 9500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === 'step-6-chat' ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_deployment', stepDetails: '{\n  "status": "deploying",\n  "env": "production",\n  "job_id": "deploy-8f92a"\n}', timestamp: new Date().toISOString() },
              { id: 'step-7-chat', role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ]
          };
        }));
      }, 11500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === 'step-7-chat' ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            status: '待操作',
            messages: [
              ...msgs,
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '部署已完成，产物和 UI 检测已生成，你可以进行预览和验证。', 
                timestamp: new Date().toISOString(),
                type: 'deploy'
              },
              {
                id: crypto.randomUUID(),
                role: 'ai',
                content: '请确认 UI 检测结果是否符合预期。',
                timestamp: new Date().toISOString(),
                type: 'ui-confirm'
              }
            ],
            panoramaState: { status: 'ready', visibleCards: [...s.panoramaState.visibleCards, 'deploy', 'ui'], data: { ...s.panoramaState.data, deploy: simData.deploy } }
          };
        }));
      }, 13500);
    }
  };

  const handleUIConfirm = (confirmed: boolean) => {
    if (!currentSessionId) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id !== currentSessionId) return s;
      
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: confirmed ? 'UI 确认无误' : 'UI 仍需调整',
        timestamp: new Date().toISOString()
      };
      
      const aiMsg: Message = confirmed ? {
        id: crypto.randomUUID(),
        role: 'ai',
        content: 'UI 验证已通过。请问您是否需要将本次变更发布到生产环境？',
        timestamp: new Date().toISOString(),
        type: 'release-confirm'
      } : {
        id: crypto.randomUUID(),
        role: 'ai',
        content: '收到，请告诉我具体需要调整的地方，我会继续为您优化。',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...s,
        status: confirmed ? '待操作' : '进行中',
        messages: [...s.messages, userMsg, aiMsg]
      };
    }));
  };

  const handleReleaseConfirm = (confirmed: boolean) => {
    if (!currentSessionId) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id !== currentSessionId) return s;
      
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: confirmed ? '需要发布' : '暂不发布',
        timestamp: new Date().toISOString()
      };
      
      if (confirmed) {
        const releasePlan = {
          id: 'RP-' + Math.floor(Math.random() * 10000),
          title: '首页动效优化发布计划',
          env: 'Production',
          version: 'v1.2.4',
          items: ['首页渐入动效', '性能优化', '移动端适配'],
          yuyanUrl: 'https://yuyan.example.com/release/123'
        };
        
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: '已为您生成发布计划单。您可以查看详情并前往雨燕平台完成发布。',
          timestamp: new Date().toISOString(),
          type: 'release'
        };
        
        return {
          ...s,
          status: '已完结',
          messages: [...s.messages, userMsg, aiMsg],
          panoramaState: {
            ...s.panoramaState,
            visibleCards: [...s.panoramaState.visibleCards, 'release'],
            data: { ...s.panoramaState.data, release: releasePlan }
          }
        };
      } else {
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: '好的，本次任务已完成。如有其他需求请随时告诉我。',
          timestamp: new Date().toISOString()
        };
        
        return {
          ...s,
          status: '已完结',
          messages: [...s.messages, userMsg, aiMsg]
        };
      }
    }));
  };

  const handleArchiveSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isArchived: true } : s));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f7fa] font-sans text-slate-800 overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          sessions={sessions}
          currentSessionId={currentSessionId} 
          onSelectSession={(id) => {
            setCurrentSessionId(id);
            setOpenDetailsTabs([]);
            setActiveDetailsTab(null);
          }} 
          onArchiveSession={handleArchiveSession}
          onRenameSession={(id) => {
            const session = sessions.find(s => s.id === id);
            if (session) {
              setRenameSession({id, title: session.title});
            }
          }}
          onDeleteSession={(id) => {
            setDeleteSessionId(id);
          }}
        />
        
        {currentSession ? (
          <div className="flex flex-1 overflow-hidden">
            <ChatArea 
              session={currentSession} 
              onSendMessage={handleSendMessage} 
              chatInput={chatInput}
              setChatInput={setChatInput}
              onMessageClick={(type) => {
                if (type && ['plan', 'doc', 'code', 'pr', 'deploy', 'ui', 'release'].includes(type)) {
                  const cardType = type as PanoramaCardType;
                  if (!openDetailsTabs.includes(cardType)) {
                    setOpenDetailsTabs([...openDetailsTabs, cardType]);
                  }
                  setActiveDetailsTab(cardType);
                }
              }}
              onUIConfirm={handleUIConfirm}
              onReleaseConfirm={handleReleaseConfirm}
            />
            <AnimatePresence>
              {openDetailsTabs.length > 0 && activeDetailsTab && (
                <DetailsPanel 
                  key="details-panel"
                  activeTab={activeDetailsTab}
                  openTabs={openDetailsTabs}
                  onTabChange={setActiveDetailsTab}
                  onCloseTab={(tab) => {
                    const newTabs = openDetailsTabs.filter(t => t !== tab);
                    setOpenDetailsTabs(newTabs);
                    if (activeDetailsTab === tab) {
                      setActiveDetailsTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
                    }
                  }}
                  onCloseAll={() => {
                    setOpenDetailsTabs([]);
                    setActiveDetailsTab(null);
                  }} 
                  onAddTextToChat={(text) => {
                    setChatInput(prev => prev ? `${prev}\n${text}` : text);
                  }}
                  panoramaState={currentSession.panoramaState}
                />
              )}
            </AnimatePresence>
            <PanoramaPanel 
              panoramaState={currentSession.panoramaState}
              onOpenDetails={(tab) => {
                if (!openDetailsTabs.includes(tab)) {
                  setOpenDetailsTabs([...openDetailsTabs, tab]);
                }
                setActiveDetailsTab(tab);
              }} 
              isOpen={isPanoramaOpen}
              onToggle={() => setIsPanoramaOpen(!isPanoramaOpen)}
            />
          </div>
        ) : (
          <EmptyChat onNewSession={handleNewSession} />
        )}
      </div>
      
      {/* Footer */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 text-xs text-slate-500 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button className="border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">English</button>
          <a href="#" className="hover:text-slate-700">服务地图</a>
          <a href="#" className="hover:text-slate-700">更新日志</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-700">隐私政策</a>
          <span className="text-slate-300">|</span>
          <span>权益保障承诺书ICP 证浙 B2-2-100257Copyright © 2020 蚂蚁集团</span>
        </div>
      </footer>

      {renameSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <h3 className="text-lg font-medium mb-4">重命名任务</h3>
            <input 
              type="text" 
              value={renameSession.title} 
              onChange={(e) => setRenameSession({...renameSession, title: e.target.value})} 
              className="w-full border border-slate-200 rounded-lg p-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenameSession(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
              <button onClick={() => {
                setSessions(prev => prev.map(s => s.id === renameSession.id ? { ...s, title: renameSession.title } : s));
                setRenameSession(null);
              }} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">确定</button>
            </div>
          </div>
        </div>
      )}

      {deleteSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <h3 className="text-lg font-medium mb-4">删除任务</h3>
            <p className="text-slate-600 mb-6">确定要删除该任务吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteSessionId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
              <button onClick={() => {
                setSessions(prev => prev.filter(s => s.id !== deleteSessionId));
                if (currentSessionId === deleteSessionId) {
                  setCurrentSessionId(null);
                }
                setDeleteSessionId(null);
              }} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
