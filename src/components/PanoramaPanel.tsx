import { ChevronRight, CheckCircle2, Circle, Upload, GitPullRequest, Box, FileText, Download, Loader2, PanelRight, Image as ImageIcon, ArrowUpCircle } from 'lucide-react';
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

  const getCardContent = (type: PanoramaCardType) => {
    const data = panoramaState.data || {};
    switch (type) {
      case 'plan':
        return {
          icon: <CheckCircle2 size={18} />,
          title: '任务步骤',
          status: data.planStatus === 'loading' ? '生成中' : '已就绪',
          statusColor: data.planStatus === 'loading' ? 'text-blue-500 bg-blue-50' : 'text-emerald-600 bg-emerald-50',
          desc: `${data.plan?.filter(p => p.status === 'completed').length || 0}/${data.plan?.length || 0} 步骤已完成`,
          isLoading: data.planStatus === 'loading'
        };
      case 'doc':
        return {
          icon: <FileText size={18} />,
          title: '技术方案',
          status: data.docStatus === 'loading' ? '生成中' : '已就绪',
          statusColor: data.docStatus === 'loading' ? 'text-blue-500 bg-blue-50' : 'text-emerald-600 bg-emerald-50',
          desc: data.docStatus === 'loading' ? '正在分析需求并生成方案' : (data.doc?.title || '技术方案文档已生成'),
          isLoading: data.docStatus === 'loading'
        };
      case 'code':
        return {
          icon: <Upload size={18} />,
          title: '代码变更',
          status: data.codeStatus === 'loading' ? '修改中' : '已提交',
          statusColor: data.codeStatus === 'loading' ? 'text-blue-500 bg-blue-50' : 'text-emerald-600 bg-emerald-50',
          desc: data.codeStatus === 'loading' ? '正在修改代码...' : `+${data.code?.added || 0} -${data.code?.removed || 0} 行代码变更`,
          isLoading: data.codeStatus === 'loading'
        };
      case 'pr':
        let pStatus = '待创建';
        let pColor = 'text-slate-500 bg-slate-100';
        let pDesc = '等待代码提交后创建';
        let pLoading = false;

        if (data.prStatus === 'loading') {
          pStatus = '创建中';
          pColor = 'text-blue-500 bg-blue-50';
          pDesc = '正在创建合并请求...';
          pLoading = true;
        } else if (data.prStatus === 'success') {
          pStatus = 'Open';
          pColor = 'text-emerald-600 bg-emerald-50';
          pDesc = `#${data.pr?.id || ''} ${data.pr?.title || ''}`;
        } else if (data.prStatus === 'merged') {
          pStatus = 'Merged';
          pColor = 'text-purple-600 bg-purple-50';
          pDesc = `#${data.pr?.id || ''} ${data.pr?.title || ''}`;
        }

        return {
          icon: <GitPullRequest size={18} />,
          title: '合并请求',
          status: pStatus,
          statusColor: pColor,
          desc: pDesc,
          isLoading: pLoading
        };
      case 'deploy':
        let dStatus = '待部署';
        let dColor = 'text-amber-600 bg-amber-50';
        let dDesc = '等待代码变更完成后部署';
        let dLoading = false;
        
        if (data.deployStatus === 'loading') {
          dStatus = '部署中';
          dColor = 'text-blue-500 bg-blue-50';
          dDesc = '正在部署至预发环境...';
          dLoading = true;
        } else if (data.deployStatus === 'success') {
          dStatus = '已部署';
          dColor = 'text-emerald-600 bg-emerald-50';
          dDesc = '已成功部署至预发环境';
        }

        return {
          icon: <ImageIcon size={18} />,
          title: '部署产物',
          status: dStatus,
          statusColor: dColor,
          desc: dDesc,
          isLoading: dLoading
        };
      case 'ui':
        let uStatus = '待检测';
        let uColor = 'text-slate-500 bg-slate-100';
        let uDesc = '等待部署完成后检测';
        let uLoading = false;

        if (data.uiStatus === 'loading') {
          uStatus = '检测中';
          uColor = 'text-blue-500 bg-blue-50';
          uDesc = '正在进行 UI 自动化检测...';
          uLoading = true;
        } else if (data.uiStatus === 'success') {
          uStatus = '无异常';
          uColor = 'text-emerald-600 bg-emerald-50';
          uDesc = 'UI 检测通过';
        }

        return {
          icon: <ImageIcon size={18} />,
          title: 'UI 检测',
          status: uStatus,
          statusColor: uColor,
          desc: uDesc,
          isLoading: uLoading
        };
      case 'promote':
        return {
          icon: <ArrowUpCircle size={18} />,
          title: '迭代推进',
          status: '就绪',
          statusColor: 'text-emerald-600 bg-emerald-50',
          desc: '开发环境验证通过，可推进迭代',
          isLoading: false
        };
      case 'release':
        let rStatus = '待生成';
        let rColor = 'text-slate-500 bg-slate-100';
        let rDesc = '等待确认发布';
        let rLoading = false;

        if (data.releaseStatus === 'loading') {
          rStatus = '生成中';
          rColor = 'text-blue-500 bg-blue-50';
          rDesc = '正在生成发布计划单...';
          rLoading = true;
        } else if (data.releaseStatus === 'success') {
          rStatus = '已生成';
          rColor = 'text-emerald-600 bg-emerald-50';
          rDesc = `版本 ${data.release?.version || ''}`;
        }

        return {
          icon: <Box size={18} />,
          title: '发布计划',
          status: rStatus,
          statusColor: rColor,
          desc: rDesc,
          isLoading: rLoading
        };
      default:
        return null;
    }
  };

  return (
    <div className={`${isOpen ? 'w-[340px]' : 'w-12'} bg-[#f8fafc] flex flex-col h-full shrink-0 border-l border-slate-200 transition-[width] duration-300 ease-in-out`}>
      <div className={`h-14 flex items-center shrink-0 bg-white border-b border-slate-200 ${isOpen ? 'justify-between px-4' : 'justify-center'}`}>
        {isOpen && <span className="font-medium text-slate-800">执行预览</span>}
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
            title={isOpen ? "收起状态面板" : "展开状态面板"}
          >
            {isOpen ? <ChevronRight size={18} /> : <PanelRight size={18} />}
          </button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${!isOpen ? 'hidden' : ''}`}>
        
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

          {panoramaState.visibleCards.map((cardType) => {
            const config = getCardContent(cardType);
            if (!config) return null;

            return (
              <motion.div 
                key={cardType}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onOpenDetails(cardType)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.isLoading ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-700'}`}>
                    {config.isLoading ? <Loader2 size={20} className="animate-spin" /> : config.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800 text-sm">{config.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.statusColor}`}>
                        {config.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {config.desc}
                    </div>
                  </div>
                  <div className="pt-2 text-slate-300 group-hover:text-slate-500 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
