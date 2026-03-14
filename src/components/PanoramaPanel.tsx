import { ChevronDown, ChevronRight, CheckCircle2, Circle, Upload, GitPullRequest, Box, FileText, Download, Loader2, PanelRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PanoramaCardType, PanoramaData } from '../types';
import SandboxDetails from './SandboxDetails';

export default function PanoramaPanel({ 
  panoramaState,
  onOpenDetails,
  isOpen,
  onToggle
}: { 
  panoramaState: { status: 'preparing' | 'ready', visibleCards: PanoramaCardType[], data?: PanoramaData },
  onOpenDetails: (tab: PanoramaCardType) => void,
  isOpen: boolean,
  onToggle: () => void
}) {
  const [showEnvDetails, setShowEnvDetails] = useState(false);
  const isPreparing = panoramaState.status === 'preparing';

  return (
    <div className={`${isOpen ? 'w-[340px]' : 'w-12'} bg-[#f8fafc] flex flex-col h-full shrink-0 border-l border-slate-200 transition-[width] duration-300 ease-in-out`}>
      <div className={`h-14 flex items-center shrink-0 bg-white border-b border-slate-200 ${isOpen ? 'justify-between px-4' : 'justify-center'}`}>
        {isOpen && <span className="font-medium text-slate-800">全景概览</span>}
        <div className="flex items-center gap-2 relative">
          {isOpen && (
            isPreparing ? (
              <div 
                onClick={() => setShowEnvDetails(!showEnvDetails)}
                className="flex items-center gap-1.5 text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <Loader2 size={12} className="animate-spin" />
                环境准备中...
              </div>
            ) : (
              <div 
                onClick={() => setShowEnvDetails(!showEnvDetails)}
                className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                环境已就位
              </div>
            )
          )}
          
          <AnimatePresence>
            {showEnvDetails && isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 z-[60] w-64"
              >
                <div className="absolute -top-1 right-12 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45"></div>
                <SandboxDetails className="shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={onToggle} 
            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
            title={isOpen ? "收起全景概览" : "展开全景概览"}
          >
            {isOpen ? <ChevronRight size={18} /> : <PanelRight size={18} />}
          </button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${!isOpen ? 'hidden' : ''}`}>
        
        <AnimatePresence>
          {isPreparing && panoramaState.visibleCards.length === 0 && (
            <motion.div 
              key="preparing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 text-slate-400"
            >
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm font-medium">AI 正在思考并生成全景信息...</p>
            </motion.div>
          )}

          {/* 任务步骤 */}
          {panoramaState.visibleCards.includes('plan') && (
            <motion.div 
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('plan')}>
                <span className="font-medium text-slate-800 text-sm">任务步骤</span>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
              <div className="px-4 pb-4 space-y-3">
                {panoramaState.data?.plan?.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    {item.status === 'completed' ? (
                      <CheckCircle2 size={16} className="text-slate-300 shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className={`text-sm ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item.text}
                      </div>
                      {item.subtext && (
                        <div className={`text-xs mt-0.5 ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                          {item.subtext}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 技术方案文档 */}
          {panoramaState.visibleCards.includes('doc') && (
            <motion.div 
              key="doc"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('doc')}>
                <span className="font-medium text-slate-800 text-sm">技术方案文档</span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </motion.div>
          )}

          {/* 代码变更 */}
          {panoramaState.visibleCards.includes('code') && (
            <motion.div 
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('code')}>
                <span className="font-medium text-slate-800 text-sm">代码变更</span>
                <div className="flex items-center gap-2">
                  <Upload size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-1.5 rounded">+{panoramaState.data?.code?.added || 0}</span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 rounded">-{panoramaState.data?.code?.removed || 0}</span>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </div>
              <div className="px-4 pb-3 space-y-2">
                {panoramaState.data?.code?.files?.map(file => (
                  <div key={file.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Box size={14} className="text-slate-600 shrink-0" />
                      <span className="text-slate-700 truncate">{file.name}</span>
                      <span className="text-xs text-slate-400 truncate">{file.path}</span>
                    </div>
                    <span className={`text-xs font-bold ${file.status === 'A' ? 'text-slate-700' : file.status === 'M' ? 'text-slate-800' : 'text-slate-500'} shrink-0 ml-2`}>{file.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 合并请求 */}
          {panoramaState.visibleCards.includes('pr') && (
            <motion.div 
              key="pr"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('pr')}>
                <span className="font-medium text-slate-800 text-sm">合并请求</span>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
              <div className="px-4 pb-4">
                <div className="text-xs font-medium text-slate-800 mb-1">#{panoramaState.data?.pr?.id || 27} {panoramaState.data?.pr?.title || 'feat: 首页增加一家渐入动效'}</div>
                <div className="flex items-center gap-1.5 mb-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-4 h-4 rounded-full bg-slate-200" />
                  <span className="text-xs text-slate-500">{panoramaState.data?.pr?.author || '崇启'} · 创建于{panoramaState.data?.pr?.createdAt || '6天前'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 mb-3">
                  <span className="truncate max-w-[100px]">{panoramaState.data?.pr?.sourceBranch || 'neoswift/home-fade-in-animati...'}</span>
                  <GitPullRequest size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate max-w-[100px]">{panoramaState.data?.pr?.targetBranch || 'sprint_neovateweb_S09001137...'}</span>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-700 mb-3">
                  <div className="font-medium mb-1">由 NeoSwift 自动创建</div>
                  <div className="font-medium mt-2 mb-1">变更总结</div>
                  <p className="text-slate-600 leading-relaxed">{panoramaState.data?.pr?.summary || '为首页添加了渐入动效，提升了页面加载时的视觉体验。主要变更包括：引入动效库、配置渐入动画参数、优化加载性能。'}</p>
                  <div className="mt-2 text-slate-500 break-all">
                    任务详情：https://NeoSwift-studio.antgroup-inc.cn/session/kk3dum71zg9l7fu4
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <FileText size={12} />
                    {panoramaState.data?.code?.files?.length || 0} files
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">自动创建 MR：</span>
                    <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">已开启</span>
                    <span className="text-slate-800 font-medium cursor-pointer">前往设置</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 部署产物 */}
          {panoramaState.visibleCards.includes('deploy') && (
            <motion.div 
              key="deploy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('deploy')}>
                <span className="font-medium text-slate-800 text-sm">部署产物</span>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
              <div className="px-4 pb-4 space-y-3">
                {panoramaState.data?.deploy?.map((artifact, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 w-16 shrink-0">{artifact.type}</span>
                    <a href="#" className="text-slate-800 font-medium hover:underline truncate mx-2">{artifact.url}</a>
                    <span className="text-slate-400 shrink-0 flex items-center gap-1">等 {artifact.count} 个 <Download size={12} /></span>
                  </div>
                ))}
                {(!panoramaState.data?.deploy || panoramaState.data.deploy.length === 0) && (
                  <div className="text-xs text-slate-500 text-center py-2">暂无部署产物</div>
                )}
              </div>
            </motion.div>
          )}

          {/* UI 检测 */}
          {panoramaState.visibleCards.includes('ui') && (
            <motion.div 
              key="ui"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('ui')}>
                <span className="font-medium text-slate-800 text-sm">UI 检测</span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </motion.div>
          )}

          {/* 发布计划 */}
          {panoramaState.visibleCards.includes('release') && (
            <motion.div 
              key="release"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onOpenDetails('release')}>
                <span className="font-medium text-slate-800 text-sm">发布计划</span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
