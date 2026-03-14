import { Plus, ArrowUp, X, ChevronDown, Lightbulb, Check, FileText, Image as ImageIcon, Box, GitBranch, ChevronLeft, ChevronRight, CheckCircle2, Circle, Upload, GitPullRequest, Download, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Session, Message, PanoramaCardType } from '../types';
import DimaModal, { Requirement } from './DimaModal';
import AppIterationModal, { AppIteration, mockData } from './AppIterationModal';
import SandboxDetails from './SandboxDetails';

interface Attachment {
  id: string;
  file: File;
  previewUrl?: string;
}

function MessageArtifactCard({ 
  type, 
  session, 
  onClick 
}: { 
  type: PanoramaCardType, 
  session: Session, 
  onClick: () => void 
}) {
  const data = session.panoramaState.data;
  
  const getCardConfig = () => {
    switch (type) {
      case 'plan':
        return {
          icon: <CheckCircle2 size={16} className="text-slate-800" />,
          title: '任务步骤',
          content: `${data?.plan?.filter(p => p.status === 'completed')?.length || 0} / ${data?.plan?.length || 0} 已完成`,
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      case 'doc':
        return {
          icon: <FileText size={16} className="text-slate-800" />,
          title: '技术方案文档',
          content: data?.doc?.title || '查看详细技术方案',
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      case 'code':
        return {
          icon: <Upload size={16} className="text-slate-800" />,
          title: '代码变更',
          content: `+${data?.code?.added || 0} -${data?.code?.removed || 0} 行代码变更`,
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      case 'pr':
        return {
          icon: <GitPullRequest size={16} className="text-slate-800" />,
          title: '合并请求',
          content: data?.pr ? `#${data.pr.id} ${data.pr.title}` : '查看合并请求详情',
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      case 'deploy':
        return {
          icon: <Download size={16} className="text-slate-800" />,
          title: '部署产物',
          content: data?.deploy?.[0]?.url || '查看部署产物列表',
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      case 'ui':
        return {
          icon: <ImageIcon size={16} className="text-slate-800" />,
          title: 'UI 检测',
          content: '查看界面视觉变更',
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      case 'release':
        return {
          icon: <Box size={16} className="text-slate-800" />,
          title: '发布计划单',
          content: data?.release?.title || '查看发布计划详情',
          color: 'bg-slate-100 border-slate-200 text-slate-800'
        };
      default:
        return null;
    }
  };

  const config = getCardConfig();
  if (!config) return null;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`mt-3 flex items-center gap-3 p-3 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all group max-w-sm ${config.color}`}
    >
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-0.5">{config.title}</div>
        <div className="text-sm font-medium truncate">{config.content}</div>
      </div>
      <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
        <ExternalLink size={14} />
      </div>
    </div>
  );
}

function UIConfirmationPanel({ onConfirm }: { onConfirm: (confirmed: boolean) => void }) {
  return (
    <div className="mb-4 bg-[#fcfcfc] border border-slate-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 font-medium">确认操作</span>
      </div>
      <h4 className="text-[15px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CheckCircle2 size={18} className="text-slate-800" />
        UI 检测结果确认
      </h4>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        请确认 UI 检测结果是否符合预期。确认后将询问您是否需要进行发布。
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => onConfirm(true)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          确认无误
        </button>
        <button 
          onClick={() => onConfirm(false)}
          className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2.5 rounded-xl transition-all active:scale-[0.98]"
        >
          仍需调整
        </button>
      </div>
    </div>
  );
}

function ReleaseConfirmationPanel({ onConfirm }: { onConfirm: (confirmed: boolean) => void }) {
  return (
    <div className="mb-4 bg-[#fcfcfc] border border-slate-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 font-medium">确认操作</span>
      </div>
      <h4 className="text-[15px] font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Upload size={18} className="text-slate-800" />
        是否需要进行发布？
      </h4>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        UI 验证已通过。如果您需要发布到生产环境，我将为您生成发布计划单。
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => onConfirm(true)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          需要发布
        </button>
        <button 
          onClick={() => onConfirm(false)}
          className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2.5 rounded-xl transition-all active:scale-[0.98]"
        >
          暂不发布
        </button>
      </div>
    </div>
  );
}

function StepMessage({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);
  const isThink = message.stepType === 'think';
  const isPending = message.stepStatus === 'pending';
  const isEnvPrep = message.content === '环境准备';

  return (
    <div className="mb-3 max-w-3xl">
      <div 
        className="flex items-center justify-between bg-[#f8fafc] hover:bg-slate-50 transition-colors rounded-2xl px-4 py-2.5 cursor-pointer border border-transparent"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${isThink ? 'bg-[#8bb4f7]' : 'bg-[#b3d4ff]'}`}>
            {isThink ? <Lightbulb size={12} className={isPending ? 'animate-pulse' : ''} /> : <Check size={12} strokeWidth={3} />}
          </div>
          <span className={`text-[13px] ${isThink ? 'text-slate-600' : 'text-slate-600 font-mono'}`}>
            {message.content}
          </span>
          {isEnvPrep && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
              详情
            </span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>
      {expanded && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-2">
          {isEnvPrep ? (
            <SandboxDetails className="shadow-none border-slate-100 bg-[#f8fafc]" />
          ) : message.stepDetails ? (
            <div className="px-4 py-3 bg-[#f8fafc] rounded-2xl text-xs text-slate-600 font-mono whitespace-pre-wrap border border-slate-100">
              {message.stepDetails}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function ChatArea({ 
  session, 
  onSendMessage,
  chatInput,
  setChatInput,
  onMessageClick,
  onUIConfirm,
  onReleaseConfirm
}: { 
  session: Session, 
  onSendMessage: (message: string) => void,
  chatInput: string,
  setChatInput: (input: string) => void,
  onMessageClick?: (type: string) => void,
  onUIConfirm?: (confirmed: boolean) => void,
  onReleaseConfirm?: (confirmed: boolean) => void
}) {
  const [isDimaModalOpen, setIsDimaModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedReqs, setSelectedReqs] = useState<Requirement[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppIteration | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [panelSelectedIndex, setPanelSelectedIndex] = useState<number | null>(null);
  const [panelInputValue, setPanelInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lastMessage = session.messages[session.messages.length - 1];
  const showUIConfirm = lastMessage?.type === 'ui-confirm';
  const showReleaseConfirm = lastMessage?.type === 'release-confirm';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSend = () => {
    let finalMessage = chatInput.trim();
    const contexts: string[] = [];

    if (selectedApp) {
      contexts.push(`目标上下文：${selectedApp.type === 'app' ? '应用' : '迭代'} - ${selectedApp.name}`);
    }

    if (selectedReqs.length > 0) {
      contexts.push(selectedReqs.map(r => `参考${r.type === 'bug' ? '缺陷' : '需求'}：${r.title}`).join('\n'));
    }

    if (attachments.length > 0) {
      contexts.push(`附件上下文：${attachments.map(a => a.file.name).join(', ')}`);
    }

    if (contexts.length > 0) {
      finalMessage = finalMessage ? `${finalMessage}\n\n${contexts.join('\n\n')}` : contexts.join('\n\n');
    }
    
    if (finalMessage) {
      onSendMessage(finalMessage);
      setChatInput('');
      setSelectedReqs([]);
      setAttachments([]);
      setSelectedApp(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDimaSelect = (req: Requirement) => {
    if (!selectedReqs.find(r => r.id === req.id)) {
      setSelectedReqs([...selectedReqs, req]);
    }
  };

  const removeReq = (id: string) => {
    setSelectedReqs(selectedReqs.filter(r => r.id !== id));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // Clean up object URLs
      const removed = prev.find(a => a.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const needsAppSelection = lastMessage?.role === 'ai' && lastMessage.type === 'app-selection';
  const needsIterationSelection = lastMessage?.role === 'ai' && lastMessage.type === 'iteration-selection';
  
  const appNameMatch = lastMessage?.content.match(/你已选择应用 \*\*(.*?)\*\*/);
  const selectedAppName = appNameMatch ? appNameMatch[1] : null;

  // Extract iteration name from messages or current selection
  const iterationName = (() => {
    if (selectedApp && selectedApp.type === 'iteration') return selectedApp.name;
    
    for (let i = session.messages.length - 1; i >= 0; i--) {
      const msg = session.messages[i];
      const match = msg.content.match(/我选择了迭代：(.*?)$|目标上下文：迭代 - (.*?)$/m);
      if (match) return match[1] || match[2];
    }
    return null;
  })();

  const isMerged = session.status === '已完结';
  const displayIteration = iterationName 
    ? (isMerged ? iterationName : (iterationName.startsWith('nchat/') ? iterationName : `nchat/${iterationName}`))
    : (isMerged ? 'v1.0.0' : 'nchat/sprint_default');

  const handleRecommendationSelect = (item: AppIteration) => {
    const message = `我选择了${item.type === 'app' ? '应用' : '迭代'}：${item.name}`;
    const contexts = [`目标上下文：${item.type === 'app' ? '应用' : '迭代'} - ${item.name}`];
    
    if (item.type === 'iteration' && item.parentApp) {
      contexts.push(`所属应用：${item.parentApp}`);
    }
    
    if (selectedReqs.length > 0) {
      contexts.push(selectedReqs.map(r => `参考${r.type === 'bug' ? '缺陷' : '需求'}：${r.title}`).join('\n'));
    }
    if (attachments.length > 0) {
      contexts.push(`附件上下文：${attachments.map(a => a.file.name).join(', ')}`);
    }

    onSendMessage(`${message}\n\n${contexts.join('\n\n')}`);
    
    setChatInput('');
    setSelectedReqs([]);
    setAttachments([]);
    setSelectedApp(null);
    setPanelSelectedIndex(null);
    setPanelInputValue('');
  };

  return (
    <div className="flex-1 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 min-w-[400px]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-6 py-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <span className="text-sm font-medium text-slate-800">{session.title}</span>
          </div>
          
          {session.messages.map((message) => (
            <div key={message.id} className={message.role === 'user' ? 'mb-10' : 'mb-3'}>
              {message.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-slate-100 rounded-2xl rounded-tr-sm px-4 py-3 text-[14px] text-slate-800 max-w-[85%] shadow-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ) : message.role === 'ai-step' ? (
                <StepMessage message={message} />
              ) : (
                <div 
                  className="flex flex-col items-start mb-2"
                >
                  <div className="prose prose-sm max-w-none text-slate-800 prose-slate prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100">
                    <Markdown>{message.content}</Markdown>
                  </div>
                  {message.type && message.type !== 'ui-confirm' && message.type !== 'release-confirm' && (
                    <MessageArtifactCard 
                      type={message.type as PanoramaCardType} 
                      session={session}
                      onClick={() => onMessageClick?.(message.type!)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto w-full p-4 relative">
          {showUIConfirm ? (
            <UIConfirmationPanel onConfirm={(confirmed) => onUIConfirm?.(confirmed)} />
          ) : showReleaseConfirm ? (
            <ReleaseConfirmationPanel onConfirm={(confirmed) => onReleaseConfirm?.(confirmed)} />
          ) : (needsAppSelection || needsIterationSelection) ? (() => {
            const panelOptions = mockData
              .filter(item => {
                if (needsAppSelection) return item.type === 'app';
                if (needsIterationSelection) {
                  if (selectedAppName) return item.type === 'iteration' && item.parentApp === selectedAppName;
                  return item.type === 'iteration';
                }
                return false;
              })
              .slice(0, 3);

            return (
              <div className="mb-0 bg-[#fcfcfc] border border-slate-200 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">需要确认</span>
                  <div className="flex gap-1 text-slate-300">
                    <ChevronLeft size={16} className="cursor-not-allowed" />
                    <ChevronRight size={16} className="cursor-not-allowed" />
                  </div>
                </div>
                <h4 className="text-[15px] font-semibold text-slate-800 mb-4">
                  {needsAppSelection ? '请选择你要操作的应用？' : '请选择你要操作的迭代？'}
                </h4>
                
                <div className="space-y-1.5 mb-4">
                  {panelOptions.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => { setPanelSelectedIndex(index); setPanelInputValue(''); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                        panelSelectedIndex === index 
                          ? 'bg-white border-slate-300 shadow-sm' 
                          : 'bg-transparent border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs border shrink-0 ${
                        panelSelectedIndex === index ? 'border-slate-300 text-slate-700 bg-white' : 'border-slate-200 text-slate-500 bg-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm text-left ${panelSelectedIndex === index ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                        {item.name}
                      </span>
                    </button>
                  ))}
                  
                  <div className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    panelSelectedIndex === -1 
                      ? 'bg-white border-slate-300 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-slate-100'
                  }`}>
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs border shrink-0 ${
                      panelSelectedIndex === -1 ? 'border-slate-300 text-slate-700 bg-white' : 'border-slate-200 text-slate-500 bg-white'
                    }`}>
                      {panelOptions.length + 1}
                    </div>
                    <span className={`text-sm shrink-0 ${panelSelectedIndex === -1 ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                      新建{needsAppSelection ? '应用' : '迭代'}：
                    </span>
                    <input 
                      type="text"
                      placeholder="填写名称..."
                      value={panelInputValue}
                      onChange={(e) => {
                        setPanelInputValue(e.target.value);
                        setPanelSelectedIndex(-1);
                      }}
                      onFocus={() => setPanelSelectedIndex(-1)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-2">
                  <button 
                    onClick={() => {
                      if (panelSelectedIndex !== null) {
                        if (panelSelectedIndex === -1 && panelInputValue.trim()) {
                          const newItem: AppIteration = {
                            id: crypto.randomUUID(),
                            name: panelInputValue.trim(),
                            type: needsAppSelection ? 'app' : 'iteration',
                            parentApp: needsIterationSelection ? selectedAppName || undefined : undefined
                          };
                          handleRecommendationSelect(newItem);
                        } else if (panelSelectedIndex >= 0) {
                          handleRecommendationSelect(panelOptions[panelSelectedIndex]);
                        }
                      }
                    }}
                    disabled={panelSelectedIndex === null || (panelSelectedIndex === -1 && !panelInputValue.trim())}
                    className="w-full text-sm bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    确认选择
                  </button>
                </div>
              </div>
            );
          })() : null}
          {!showUIConfirm && !showReleaseConfirm && !needsAppSelection && !needsIterationSelection && (
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all">
              {(selectedReqs.length > 0 || attachments.length > 0 || selectedApp) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedApp && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                    selectedApp.type === 'app' ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {selectedApp.type === 'app' ? <Box size={12} /> : <GitBranch size={12} />}
                    <span className="truncate max-w-[200px]">{selectedApp.name}</span>
                    <button 
                      onClick={() => setSelectedApp(null)}
                      className="ml-1 p-0.5 rounded-md hover:bg-white/50 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {selectedReqs.map(req => (
                  <div 
                    key={req.id} 
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                      req.type === 'bug' 
                        ? 'bg-slate-100 text-slate-800 border-slate-200' 
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {req.type === 'bug' ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    )}
                    <span className="truncate max-w-[200px]">{req.title}</span>
                    <button 
                      onClick={() => removeReq(req.id)}
                      className={`ml-1 p-0.5 rounded-md hover:bg-white/50 ${
                        req.type === 'bug' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {attachments.map(attachment => (
                  <div 
                    key={attachment.id}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-medium border bg-slate-50 text-slate-600 border-slate-100"
                  >
                    {attachment.previewUrl ? (
                      <img src={attachment.previewUrl} className="w-4 h-4 rounded object-cover" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <FileText size={14} className="text-slate-400" />
                    )}
                    <span className="truncate max-w-[150px]">{attachment.file.name}</span>
                    <button 
                      onClick={() => removeAttachment(attachment.id)}
                      className="ml-1 p-0.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <textarea 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="说出你的想法（可使用 @ 添加上下文；使用 / 唤起命令）"
              className="w-full resize-none outline-none text-sm min-h-[60px] max-h-[200px] text-slate-700 placeholder:text-slate-400 bg-transparent"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange}
                />
                <button 
                  onClick={handleFileClick}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <Plus size={18} />
                </button>
                {selectedApp ? (
                  <span className="text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                    {selectedApp.name}
                  </span>
                ) : (
                  <button 
                    onClick={() => setIsAppModalOpen(true)}
                    className="text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    应用/迭代
                  </button>
                )}
                <button 
                  onClick={() => setIsDimaModalOpen(true)}
                  className="text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  Dima
                </button>
              </div>
              <button 
                onClick={handleSend}
                disabled={!chatInput.trim() && selectedReqs.length === 0 && attachments.length === 0 && !selectedApp}
                className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium px-2 relative group">
            <span className="flex items-center gap-1.5 cursor-help">
              <span className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[8px] bg-slate-50 text-slate-500">N</span> 
              {displayIteration}
            </span>

            {/* Sandbox Environment Details Hover Panel */}
            <SandboxDetails className="absolute bottom-full left-2 mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none group-hover:pointer-events-auto" />
          </div>
        </div>
      </div>

      <DimaModal 
        isOpen={isDimaModalOpen} 
        onClose={() => setIsDimaModalOpen(false)} 
        onSelect={handleDimaSelect} 
      />

      <AppIterationModal 
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSelect={(item) => setSelectedApp(item)}
      />
    </div>
  );
}
