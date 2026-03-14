import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Requirement {
  id: string;
  title: string;
  priority: '高' | '中' | '低';
  status: '待开发' | '开发中' | '规划中';
  type: 'bug' | 'feature';
}

const mockRequirements: Requirement[] = [
  { id: 'DIMA-1024', title: '支持批量导出用户数据', priority: '高', status: '待开发', type: 'feature' },
  { id: 'DIMA-1025', title: '修改产品查询 bizcode 一页只有 50，改成滚动加载', priority: '中', status: '开发中', type: 'bug' },
  { id: 'DIMA-1026', title: '雨燕MCP 新增查询cube预发、生产部署的版本号', priority: '高', status: '待开发', type: 'feature' },
  { id: 'DIMA-1027', title: 'ATS 应用产物显示问题', priority: '中', status: '待开发', type: 'bug' },
  { id: 'DIMA-1028', title: '优化首页加载性能', priority: '低', status: '规划中', type: 'feature' },
];

export default function DimaModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (req: Requirement) => void; 
}) {
  const [search, setSearch] = useState('');

  const filteredReqs = mockRequirements.filter(req => 
    req.title.toLowerCase().includes(search.toLowerCase()) || 
    req.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] mx-4"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">选择 Dima 需求/缺陷</h3>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索需求标题或 ID..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {filteredReqs.length > 0 ? (
                <div className="space-y-4">
                  {['feature', 'bug'].map(type => {
                    const items = filteredReqs.filter(req => req.type === type);
                    if (items.length === 0) return null;
                    return (
                      <div key={type}>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                          {type === 'feature' ? '需求' : '缺陷'}
                        </div>
                        <div className="space-y-1">
                          {items.map(req => (
                            <div 
                              key={req.id}
                              onClick={() => {
                                onSelect(req);
                                onClose();
                              }}
                              className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors font-medium group"
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${req.type === 'bug' ? 'bg-slate-100 text-slate-700 group-hover:bg-slate-200' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'} transition-colors`}>
                                {req.type === 'bug' ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="truncate">{req.title}</div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-normal">
                                  <span>{req.id}</span>
                                  <span className="flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${req.priority === '高' ? 'bg-slate-800' : req.priority === '中' ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
                                    {req.priority}优先级
                                  </span>
                                  <span>{req.status}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  没有找到相关需求
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
