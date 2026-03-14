import { useState, useEffect, useRef } from 'react';
import { X, Search, Filter, RefreshCw, Maximize2, GitCommit, GitPullRequest, CheckCircle2, Circle, PlayCircle, FileText, Plus, Loader2, Box, ExternalLink, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { PanoramaCardType, PanoramaData } from '../types';

function DocDetails({ 
  doc, 
  onAddTextToChat 
}: { 
  doc?: PanoramaData['doc'], 
  onAddTextToChat?: (text: string) => void 
}) {
  const [selectionRect, setSelectionRect] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
        const text = selection.toString().trim();
        if (text) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          
          if (containerRect) {
            setSelectionRect({
              top: rect.top - containerRect.top - 40, // Position above selection
              left: rect.left - containerRect.left + (rect.width / 2) - 50, // Center horizontally
            });
            setSelectedText(text);
          }
        }
      } else {
        setSelectionRect(null);
        setSelectedText('');
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);

  if (!doc) {
    return <div className="text-sm text-slate-500 text-center mt-10">暂无规划文档</div>;
  }

  return (
    <div className="relative h-full" ref={containerRef}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">{doc.title}</h3>
        <div className="prose prose-sm max-w-none text-slate-600">
          <ReactMarkdown>{doc.content}</ReactMarkdown>
        </div>

        {doc.supplementaryData && (
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Box size={16} className="text-slate-500" />
              补充数据
            </h4>

            {doc.supplementaryData.apiChanges && doc.supplementaryData.apiChanges.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">API 变更</h5>
                <div className="space-y-2">
                  {doc.supplementaryData.apiChanges.map((api, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          api.method === 'GET' ? 'bg-blue-100 text-blue-700' : 
                          api.method === 'POST' ? 'bg-green-100 text-green-700' : 
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {api.method}
                        </span>
                        <code className="text-xs text-slate-700 font-mono">{api.path}</code>
                      </div>
                      <div className="text-xs text-slate-500">{api.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doc.supplementaryData.dbChanges && doc.supplementaryData.dbChanges.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">数据库变更</h5>
                <div className="space-y-2">
                  {doc.supplementaryData.dbChanges.map((db, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          {db.action}
                        </span>
                        <code className="text-xs text-slate-700 font-mono">{db.table}</code>
                      </div>
                      <div className="text-xs text-slate-500">{db.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doc.supplementaryData.dependencies && doc.supplementaryData.dependencies.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">依赖变更</h5>
                <div className="space-y-2">
                  {doc.supplementaryData.dependencies.map((dep, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          dep.action === 'ADD' ? 'bg-emerald-100 text-emerald-700' : 
                          dep.action === 'UPDATE' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {dep.action}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{dep.name}</span>
                      </div>
                      <code className="text-xs text-slate-500 font-mono">{dep.version}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectionRect && (
        <div 
          className="absolute z-10 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-md shadow-lg cursor-pointer hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          style={{ top: selectionRect.top, left: selectionRect.left }}
          onClick={() => {
            if (onAddTextToChat) {
              onAddTextToChat(`关于文档中的：“${selectedText}”，`);
            }
            setSelectionRect(null);
            window.getSelection()?.removeAllRanges();
          }}
        >
          <Plus size={14} />
          添加到对话
        </div>
      )}
    </div>
  );
}

function ReleaseDetails({ release }: { release?: any }) {
  if (!release) return <div className="text-sm text-slate-500 text-center mt-10">暂无发布计划</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
          <Box size={20} />
        </div>
        <div>
          <h3 className="font-medium text-slate-800">{release.title}</h3>
          <div className="text-xs text-slate-500 mt-0.5">ID: {release.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">发布环境</div>
          <div className="text-sm font-medium text-slate-700">{release.env}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">版本号</div>
          <div className="text-sm font-medium text-slate-700">{release.version}</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-800 mb-3">发布项</h4>
        <div className="space-y-2">
          {release.items.map((item: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 size={14} className="text-slate-800" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <a 
          href={release.yuyanUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm"
        >
          前往雨燕发布
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

export default function DetailsPanel({ 
  activeTab,
  openTabs,
  onTabChange,
  onCloseTab,
  onCloseAll,
  onAddTextToChat,
  panoramaState
}: { 
  activeTab: PanoramaCardType,
  openTabs: PanoramaCardType[],
  onTabChange: (tab: PanoramaCardType) => void,
  onCloseTab: (tab: PanoramaCardType) => void,
  onCloseAll: () => void,
  onAddTextToChat?: (text: string) => void,
  panoramaState?: { data?: PanoramaData }
}) {
  const allTabs: { id: PanoramaCardType, label: string }[] = [
    { id: 'plan', label: '任务步骤' },
    { id: 'doc', label: '技术方案文档' },
    { id: 'code', label: '代码变更' },
    { id: 'pr', label: '合并请求' },
    { id: 'deploy', label: '部署产物' },
    { id: 'ui', label: 'UI 检测' },
    { id: 'release', label: '发布计划' },
  ];

  const visibleTabs = allTabs.filter(t => openTabs.includes(t.id));

  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 400, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="bg-white border-r border-slate-200 flex flex-col h-full shrink-0 overflow-hidden"
    >
      <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-slate-200">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          {visibleTabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-sm font-medium relative h-14 flex items-center gap-2 cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span>{tab.label}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-0.5 rounded-sm hover:bg-slate-100 text-slate-400 hover:text-slate-600 ${activeTab === tab.id ? 'hover:bg-slate-200 hover:text-slate-900' : ''}`}
              >
                <X size={14} />
              </button>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full" />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-400 ml-4 shrink-0">
          <button className="p-1.5 hover:bg-slate-100 rounded-md"><Maximize2 size={16} /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded-md" onClick={onCloseAll}><X size={16} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-800">执行计划</h3>
              <span className="text-xs text-slate-500">共 {panoramaState?.data?.plan?.length || 0} 个任务</span>
            </div>
            
            <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-4">
              {panoramaState?.data?.plan?.map((item, index) => {
                const isCompleted = item.status === 'completed';
                const isCurrent = !isCompleted && (index === 0 || panoramaState.data!.plan![index - 1].status === 'completed');
                
                return (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[11px] top-1 bg-white">
                      {isCompleted ? (
                        <CheckCircle2 size={20} className="text-slate-800 bg-white" />
                      ) : isCurrent ? (
                        <Loader2 size={20} className="text-slate-800 animate-spin bg-white" />
                      ) : (
                        <Circle size={20} className="text-slate-300 bg-white" />
                      )}
                    </div>
                    <div className="pl-6">
                      <div className={`text-sm font-medium transition-colors duration-300 ${isCompleted ? 'text-slate-500 line-through' : isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                        {item.text}
                      </div>
                      {item.subtext && (
                        <div className={`text-xs mt-1 transition-colors duration-300 ${isCompleted ? 'text-slate-400' : isCurrent ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item.subtext}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'doc' && (
          <DocDetails doc={panoramaState?.data?.doc} onAddTextToChat={onAddTextToChat} />
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="搜索文件..." className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md w-48 focus:outline-none focus:border-slate-400" />
                </div>
                <button className="p-1.5 text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50"><Filter size={14} /></button>
              </div>
              <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800">
                <RefreshCw size={12} /> 刷新
              </button>
            </div>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 border-b border-slate-200 flex justify-between">
                <span>src/components/HeroSection.tsx</span>
                <span className="text-slate-900">M</span>
              </div>
              <div className="p-3 text-xs font-mono bg-[#f8fafc] overflow-x-auto">
                <div className="flex text-slate-400"><span className="w-8 text-right pr-2 select-none">42</span><span className="text-slate-600">  return (</span></div>
                <div className="flex text-slate-400"><span className="w-8 text-right pr-2 select-none">43</span><span className="text-slate-600">    &lt;div className="relative"&gt;</span></div>
                <div className="flex bg-slate-100 text-slate-600"><span className="w-8 text-right pr-2 select-none text-slate-400">44</span><span>-     &lt;div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-500 opacity-20" /&gt;</span></div>
                <div className="flex bg-slate-100 text-slate-600"><span className="w-8 text-right pr-2 select-none text-slate-400">44</span><span>+     &lt;div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-500 opacity-20 blur-3xl animate-pulse" /&gt;</span></div>
                <div className="flex text-slate-400"><span className="w-8 text-right pr-2 select-none">45</span><span className="text-slate-600">      &lt;div className="container mx-auto px-4 py-20"&gt;</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pr' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-800">
                <GitPullRequest size={20} />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">#27 feat: 首页增加一家渐入动效</h3>
                <div className="text-xs text-slate-500 mt-0.5">由 NeoSwift 自动创建</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">源分支</span>
                <span className="font-mono text-slate-700">sprint_neovateweb_S09001137...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">目标分支</span>
                <span className="font-mono text-slate-700">master</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">状态</span>
                <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">Open</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-800 mb-3">提交记录</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <GitCommit size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-700">feat: add blur animation to hero section</div>
                    <div className="text-xs text-slate-400 mt-0.5">崇启 · 2 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800 mb-4">部署产物</h3>
            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="text-sm font-medium text-slate-800 mb-1">在线页面</div>
                <a href="#" className="text-xs text-slate-800 hover:underline break-all">https://render.alipay.com/p/yuyan/180020010001210134/index.html?caprMode=sync</a>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <div className="text-sm font-medium text-slate-800 mb-1">静态资源</div>
                <a href="#" className="text-xs text-slate-800 hover:underline break-all">https://gw.alipayobjects.com/os/neovateweb/866.5421ef482.async.js</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ui' && (
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800 mb-4">UI 检测</h3>
            <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
              UI 预览加载中...
            </div>
          </div>
        )}

        {activeTab === 'release' && (
          <ReleaseDetails release={panoramaState?.data?.release} />
        )}
      </div>
    </motion.div>
  );
}
