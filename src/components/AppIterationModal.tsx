import { X, Search, Box, GitBranch, Plus } from 'lucide-react';
import { useState } from 'react';

export interface AppIteration {
  id: string;
  name: string;
  type: 'app' | 'iteration';
  parentApp?: string;
}

export const mockData: AppIteration[] = [
  { id: 'app-1', name: '雨燕MCP', type: 'app' },
  { id: 'iter-1-1', name: 'sprint_yuyanAssetsNew', type: 'iteration', parentApp: '雨燕MCP' },
  { id: 'iter-1-2', name: 'sprint_mcp_v2.5', type: 'iteration', parentApp: '雨燕MCP' },
  { id: 'app-2', name: 'ATS 应用产物', type: 'app' },
  { id: 'iter-2-1', name: 'ats_prod_display_fix', type: 'iteration', parentApp: 'ATS 应用产物' },
  { id: 'app-3', name: '产品查询服务', type: 'app' },
  { id: 'iter-3-1', name: 'bizcode_scroll_loading', type: 'iteration', parentApp: '产品查询服务' },
];

export default function AppIterationModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (item: AppIteration) => void; 
}) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredData = mockData.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.parentApp && item.parentApp.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">选择应用或迭代</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="搜索应用或迭代名称..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-slate-400 border rounded-2xl outline-none text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredData.length > 0 ? (
              <div className="space-y-4">
                {['app', 'iteration'].map(type => {
                  const items = filteredData.filter(item => item.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                        {type === 'app' ? '应用' : '迭代'}
                      </div>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onSelect(item);
                              onClose();
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 group transition-all text-left border border-transparent hover:border-slate-200"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              item.type === 'app' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {item.type === 'app' ? <Box size={20} /> : <GitBranch size={20} />}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{item.name}</div>
                              <div className="text-xs text-slate-400">
                                {item.type === 'app' ? '应用' : `迭代 · 所属应用: ${item.parentApp}`}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {search.trim() && !filteredData.find(item => item.name.toLowerCase() === search.trim().toLowerCase()) && (
                  <button
                    onClick={() => {
                      onSelect({
                        id: crypto.randomUUID(),
                        name: search.trim(),
                        type: 'iteration', // Defaulting to iteration for new items in modal, though it could be app
                      });
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 group transition-all text-left border border-transparent hover:border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 text-slate-600">
                      <Plus size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800 group-hover:text-slate-900">新建 "{search.trim()}"</div>
                      <div className="text-xs text-slate-400">创建新应用或迭代</div>
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-slate-300 mb-2 flex justify-center">
                  <Search size={48} strokeWidth={1} />
                </div>
                <p className="text-slate-400 text-sm mb-4">未找到相关应用或迭代</p>
                {search.trim() && (
                  <button
                    onClick={() => {
                      onSelect({
                        id: crypto.randomUUID(),
                        name: search.trim(),
                        type: 'iteration',
                      });
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    <Plus size={16} />
                    新建 "{search.trim()}"
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
