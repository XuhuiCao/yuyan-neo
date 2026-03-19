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
    title: `${isBug ? 'fix' : 'feat'}: ${message.split('\n')[0].substring(0, 30)}`,
    author: 'AI Assistant',
    createdAt: '刚刚',
    sourceBranch: `feature/ai-${Date.now().toString().slice(-6)}`,
    targetBranch: 'master',
    summary: `### 变更背景\n${message || '根据用户指令进行代码优化。'}\n\n### 修改内容\n- **逻辑层**：${isBug ? '修复了边界条件下的异常处理' : '重构了核心业务组件，提升可维护性'}\n- **表现层**：${isStyle ? '优化了响应式布局与色彩体系' : '增加了交互反馈与加载状态'}\n- **工程化**：更新了相关依赖版本，确保环境一致性\n\n### 验证建议\n- 重点关注部署环境中的交互表现\n- 检查不同屏幕尺寸下的兼容性`
  };

  const build = {
    duration: '45s',
    artifacts: [
      { name: 'dist.zip', url: `https://cdn.neovate.dev/artifacts/${Date.now().toString().slice(-6)}.zip`, size: '2.4 MB' }
    ]
  };

  const deploy = [
    { type: '预发环境 (Staging)', url: `https://staging-${Date.now().toString().slice(-6)}.neovate.dev`, count: 1 },
  ];

  return { plan, doc, code, pr, build, deploy };
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [openDetailsTabs, setOpenDetailsTabs] = useState<PanoramaCardType[]>([]);
  const [activeDetailsTab, setActiveDetailsTab] = useState<PanoramaCardType | null>(null);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
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
    
    const step1Id = crypto.randomUUID();
    const step2Id = crypto.randomUUID();
    const step3Id = crypto.randomUUID();
    const step4Id = crypto.randomUUID();
    const step5Id = crypto.randomUUID();
    const stepBuildId = crypto.randomUUID();
    const step6Id = crypto.randomUUID();
    const step7Id = crypto.randomUUID();

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
          id: step1Id,
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
        const msgs = s.messages.map(m => m.id === step1Id ? { ...m, stepStatus: 'success' as const } : m);
        
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
            { id: step2Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
          );
        }

        const updatedPlan = simData.plan?.map(p => ['p1'].includes(p.id) ? { ...p, status: 'completed' as const } : p);

        return {
          ...s,
          messages: nextMessages,
          panoramaState: selectedApp?.type === 'iteration' 
            ? { 
                ...s.panoramaState, 
                visibleCards: ['plan'], 
                data: { 
                  ...s.panoramaState.data, 
                  planStatus: 'success',
                  plan: updatedPlan
                } 
              }
            : s.panoramaState
        };
      }));
    }, 1500);

    if (selectedApp?.type === 'iteration') {
      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === step2Id ? { ...m, stepStatus: 'success' as const } : m);
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
              { id: step3Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'doc'])), 
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan,
                docStatus: 'success',
                doc: simData.doc,
                codeStatus: 'loading'
              } 
            }
          };
        }));
      }, 3500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === step3Id ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
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
                content: isAutoCreatePR ? '代码修改已完成，正在为你创建合并请求...' : '代码修改已完成，请在全景图中确认并创建合并请求。', 
                timestamp: new Date().toISOString(),
                type: 'code'
              },
              { id: step4Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'code', 'pr'])),
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan, 
                codeStatus: 'success',
                code: simData.code,
                prStatus: isAutoCreatePR ? 'loading' : 'pending'
              } 
            }
          };
        }));
      }, 5500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === step4Id ? { ...m, stepStatus: 'success' as const } : m);
          
          if (!isAutoCreatePR) {
            return {
              ...s,
              status: '待操作',
              panoramaState: { ...s.panoramaState, status: 'ready' }
            };
          }

          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__create_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "pr_url": "https://git.example.com/pr/27",\n  "status": "created"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '合并请求已创建，正在等待合并...', 
                timestamp: new Date().toISOString(),
                type: 'pr'
              },
              { id: step5Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'pr'])),
              data: { 
                ...s.panoramaState.data, 
                prStatus: 'success',
                pr: simData.pr
              } 
            }
          };
        }));
      }, 7500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === step5Id ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__merge_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "status": "merged"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '合并请求已合并，正在进行构建...', 
                timestamp: new Date().toISOString(),
              },
              { id: stepBuildId, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'build'])),
              data: { 
                ...s.panoramaState.data, 
                prStatus: 'merged',
                buildStatus: 'loading'
              } 
            }
          };
        }));
      }, 9500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === stepBuildId ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_build', stepDetails: '{\n  "status": "success",\n  "duration": "45s"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '构建已完成，正在部署至预发环境...', 
                timestamp: new Date().toISOString(),
              },
              { id: step6Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'deploy'])),
              data: { 
                ...s.panoramaState.data, 
                buildStatus: 'success',
                build: simData.build,
                deployStatus: 'loading'
              } 
            }
          };
        }));
      }, 11500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === step6Id ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_deployment', stepDetails: '{\n  "status": "success",\n  "env": "staging",\n  "url": "https://staging-8f92a.neovate.dev"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '部署已完成，正在进行 UI 自动化检测...', 
                timestamp: new Date().toISOString(),
              },
              { id: step7Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'ui'])),
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan,
                deployStatus: 'success',
                deploy: simData.deploy,
                uiStatus: 'loading'
              } 
            }
          };
        }));
      }, 13500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== newSession.id) return s;
          const msgs = s.messages.map(m => m.id === step7Id ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4', 'p5'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            status: '待操作',
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__run_ui_tests', stepDetails: '{\n  "visual_diff": "none",\n  "accessibility_score": 98\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: 'UI 检测通过，所有流程已完成。请确认检测结果。', 
                timestamp: new Date().toISOString(),
                type: 'ui-confirm'
              },
            ],
            panoramaState: { 
              ...s.panoramaState, 
              status: 'ready',
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan,
                uiStatus: 'success'
              } 
            }
          };
        }));
      }, 15500);
    }
  };

  const handleSendMessage = (message: string) => {
    if (!currentSessionId) return;

    const stepId = crypto.randomUUID();
    const step2Id = crypto.randomUUID();
    const step3Id = crypto.randomUUID();
    const step4Id = crypto.randomUUID();
    const step5Id = crypto.randomUUID();
    const stepBuildId = crypto.randomUUID();
    const step6Id = crypto.randomUUID();
    const step7Id = crypto.randomUUID();
    
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
              { id: step2Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            );
          }

          const updatedPlan = simData.plan?.map(p => ['p1'].includes(p.id) ? { ...p, status: 'completed' as const } : p);

          return {
            ...s,
            appName: appName || s.appName,
            messages: nextMessages,
            panoramaState: isIterationSelected
              ? { 
                  ...s.panoramaState, 
                  visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'plan', 'doc'])), 
                  data: { 
                    ...s.panoramaState.data, 
                    planStatus: 'success',
                    plan: updatedPlan,
                    docStatus: 'loading'
                  } 
                }
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
          const msgs = s.messages.map(m => m.id === step2Id ? { ...m, stepStatus: 'success' as const } : m);
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
              { id: step3Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'doc'])), 
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan,
                docStatus: 'success',
                doc: simData.doc,
                codeStatus: 'loading'
              } 
            }
          };
        }));
      }, 3500);

      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === step3Id ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
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
                content: isAutoCreatePR ? '代码修改已完成，正在为你创建合并请求...' : '代码修改已完成，请在全景图中确认并创建合并请求。', 
                timestamp: new Date().toISOString(),
                type: 'code'
              },
              { id: step4Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'code', 'pr'])),
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan, 
                codeStatus: 'success',
                code: simData.code,
                prStatus: isAutoCreatePR ? 'loading' : 'pending'
              } 
            }
          };
        }));
      }, 5500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === step4Id ? { ...m, stepStatus: 'success' as const } : m);
          
          if (!isAutoCreatePR) {
            return {
              ...s,
              status: '待操作',
              panoramaState: { ...s.panoramaState, status: 'ready' }
            };
          }

          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__create_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "pr_url": "https://git.example.com/pr/27",\n  "status": "created"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '合并请求已创建，正在等待合并...', 
                timestamp: new Date().toISOString(),
                type: 'pr'
              },
              { id: step5Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'pr'])),
              data: { 
                ...s.panoramaState.data, 
                prStatus: 'success',
                pr: simData.pr
              } 
            }
          };
        }));
      }, 7500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === step5Id ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__merge_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "status": "merged"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '合并请求已合并，正在进行构建...', 
                timestamp: new Date().toISOString(),
              },
              { id: stepBuildId, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'build'])),
              data: { 
                ...s.panoramaState.data, 
                prStatus: 'merged',
                buildStatus: 'loading'
              } 
            }
          };
        }));
      }, 9500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === stepBuildId ? { ...m, stepStatus: 'success' as const } : m);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_build', stepDetails: '{\n  "status": "success",\n  "duration": "45s"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '构建已完成，正在部署至预发环境...', 
                timestamp: new Date().toISOString(),
              },
              { id: step6Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'deploy'])),
              data: { 
                ...s.panoramaState.data, 
                buildStatus: 'success',
                build: simData.build,
                deployStatus: 'loading'
              } 
            }
          };
        }));
      }, 11500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === step6Id ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_deployment', stepDetails: '{\n  "status": "success",\n  "env": "staging",\n  "url": "https://staging-8f92a.neovate.dev"\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: '部署已完成，正在进行 UI 自动化检测...', 
                timestamp: new Date().toISOString(),
              },
              { id: step7Id, role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
            ],
            panoramaState: { 
              ...s.panoramaState, 
              visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'ui'])),
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan,
                deployStatus: 'success',
                deploy: simData.deploy,
                uiStatus: 'loading'
              } 
            }
          };
        }));
      }, 13500);

      setTimeout(() => {
        const isAutoCreatePR = JSON.parse(localStorage.getItem('autoCreatePR') ?? 'true');
        if (!isAutoCreatePR) return;
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          const msgs = s.messages.map(m => m.id === step7Id ? { ...m, stepStatus: 'success' as const } : m);
          const updatedPlan = simData.plan?.map(p => ['p1', 'p2', 'p3', 'p4', 'p5'].includes(p.id) ? { ...p, status: 'completed' as const } : p);
          return {
            ...s,
            status: '待操作',
            messages: [
              ...msgs,
              { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__run_ui_tests', stepDetails: '{\n  "visual_diff": "none",\n  "accessibility_score": 98\n}', timestamp: new Date().toISOString() },
              { 
                id: crypto.randomUUID(), 
                role: 'ai', 
                content: 'UI 检测通过，所有流程已完成。请确认检测结果。', 
                timestamp: new Date().toISOString(),
                type: 'ui-confirm'
              },
            ],
            panoramaState: { 
              ...s.panoramaState, 
              status: 'ready',
              data: { 
                ...s.panoramaState.data, 
                plan: updatedPlan,
                uiStatus: 'success'
              } 
            }
          };
        }));
      }, 15500);
    }
  };

  const handleCreatePR = () => {
    if (!currentSessionId) return;

    const simData = generateSimulationData('');

    setSessions(prev => prev.map(s => {
      if (s.id !== currentSessionId) return s;
      
      return {
        ...s,
        panoramaState: {
          ...s.panoramaState,
          data: {
            ...s.panoramaState.data,
            prStatus: 'loading'
          }
        }
      };
    }));

    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;
        return {
          ...s,
          messages: [
            ...s.messages,
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__create_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "pr_url": "https://git.example.com/pr/27",\n  "status": "created"\n}', timestamp: new Date().toISOString() },
            { 
              id: crypto.randomUUID(), 
              role: 'ai', 
              content: '合并请求已创建，正在等待合并...', 
              timestamp: new Date().toISOString(),
              type: 'pr'
            },
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
          ],
          panoramaState: { 
            ...s.panoramaState, 
            data: { 
              ...s.panoramaState.data, 
              prStatus: 'success',
              pr: simData.pr
            } 
          }
        };
      }));
    }, 2000);

    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;
        const msgs = s.messages.map(m => m.stepStatus === 'pending' ? { ...m, stepStatus: 'success' as const } : m);
        return {
          ...s,
          messages: [
            ...msgs,
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__merge_pull_request', stepDetails: '{\n  "pr_id": 27,\n  "status": "merged"\n}', timestamp: new Date().toISOString() },
            { 
              id: crypto.randomUUID(), 
              role: 'ai', 
              content: '合并请求已合并，正在进行构建...', 
              timestamp: new Date().toISOString(),
            },
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
          ],
          panoramaState: {
            ...s.panoramaState,
            visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'build'])),
            data: {
              ...s.panoramaState.data,
              prStatus: 'merged',
              buildStatus: 'loading'
            }
          }
        };
      }));
    }, 4000);

    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;
        const msgs = s.messages.map(m => m.stepStatus === 'pending' ? { ...m, stepStatus: 'success' as const } : m);
        return {
          ...s,
          messages: [
            ...msgs,
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_build', stepDetails: '{\n  "status": "success",\n  "duration": "45s"\n}', timestamp: new Date().toISOString() },
            { 
              id: crypto.randomUUID(), 
              role: 'ai', 
              content: '构建已完成，正在部署至预发环境...', 
              timestamp: new Date().toISOString(),
            },
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
          ],
          panoramaState: {
            ...s.panoramaState,
            visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'deploy'])),
            data: {
              ...s.panoramaState.data,
              buildStatus: 'success',
              build: simData.build,
              deployStatus: 'loading'
            }
          }
        };
      }));
    }, 6000);

    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;
        const msgs = s.messages.map(m => m.stepStatus === 'pending' ? { ...m, stepStatus: 'success' as const } : m);
        return {
          ...s,
          messages: [
            ...msgs,
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'tool', stepStatus: 'success', content: 'mcp__trigger_deployment', stepDetails: '{\n  "status": "success",\n  "env": "staging",\n  "url": "https://staging-8f92a.neovate.dev"\n}', timestamp: new Date().toISOString() },
            { 
              id: crypto.randomUUID(), 
              role: 'ai', 
              content: '部署已完成，正在进行 UI 自动化检测...', 
              timestamp: new Date().toISOString(),
            },
            { id: crypto.randomUUID(), role: 'ai-step', stepType: 'think', stepStatus: 'pending', content: '思考中', timestamp: new Date().toISOString() }
          ],
          panoramaState: {
            ...s.panoramaState,
            visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'ui'])),
            data: {
              ...s.panoramaState.data,
              deployStatus: 'success',
              deploy: simData.deploy,
              uiStatus: 'loading'
            }
          }
        };
      }));
    }, 8000);

    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;
        const msgs = s.messages.map(m => m.stepStatus === 'pending' ? { ...m, stepStatus: 'success' as const } : m);
        return {
          ...s,
          status: '待操作',
          messages: [
            ...msgs,
            { 
              id: crypto.randomUUID(), 
              role: 'ai', 
              content: '所有流程已完成，你可以进行验证。', 
              timestamp: new Date().toISOString(),
              type: 'ui-confirm'
            }
          ],
          panoramaState: { 
            ...s.panoramaState,
            status: 'ready', 
            data: { 
              ...s.panoramaState.data, 
              uiStatus: 'success'
            } 
          }
        };
      }));
    }, 10000);
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
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: '正在为您生成发布计划单...',
          timestamp: new Date().toISOString(),
        };
        
        return {
          ...s,
          status: '进行中',
          messages: [...s.messages, userMsg, aiMsg],
          panoramaState: {
            ...s.panoramaState,
            visibleCards: Array.from(new Set([...s.panoramaState.visibleCards, 'release'])),
            data: { ...s.panoramaState.data, releaseStatus: 'loading' }
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

    if (confirmed) {
      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          
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
            messages: [...s.messages, aiMsg],
            panoramaState: {
              ...s.panoramaState,
              data: { ...s.panoramaState.data, releaseStatus: 'success', release: releasePlan }
            }
          };
        }));
      }, 2000);
    }
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
          onRenameSession={(id, newTitle) => {
            setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
          }}
          onDeleteSession={(id) => {
            setDeleteSessionId(id);
          }}
          onPinSession={(id) => {
            setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
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
                if (type && ['plan', 'doc', 'code', 'pr', 'build', 'deploy', 'ui', 'release'].includes(type)) {
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
                  onCreatePR={handleCreatePR}
                  onUpdatePR={(data) => {
                    setSessions(prev => prev.map(s => {
                      if (s.id !== currentSessionId) return s;
                      if (!s.panoramaState.data?.pr) return s;
                      return {
                        ...s,
                        panoramaState: {
                          ...s.panoramaState,
                          data: {
                            ...s.panoramaState.data,
                            pr: {
                              ...s.panoramaState.data.pr,
                              ...data
                            }
                          }
                        }
                      };
                    }));
                  }}
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
