import { ArrowUp, Plus, ChevronDown, X, FileText, Image as ImageIcon, Box, GitBranch } from 'lucide-react';
import { useState, useRef } from 'react';
import DimaModal, { Requirement } from './DimaModal';
import AppIterationModal, { AppIteration } from './AppIterationModal';

const recommendedReqs: Requirement[] = [
  { id: 'DIMA-1025', title: '修改产品查询 bizcode 一页只有 50，改成滚动加载', priority: '中', status: '开发中', type: 'bug' },
  { id: 'DIMA-1026', title: '雨燕MCP 新增查询cube预发、生产部署的版本号', priority: '高', status: '待开发', type: 'feature' },
  { id: 'DIMA-1027', title: 'ATS 应用产物显示问题', priority: '中', status: '待开发', type: 'bug' },
];

interface Attachment {
  id: string;
  file: File;
  previewUrl?: string;
}

export default function EmptyChat({ onNewSession }: { onNewSession: (message: string, selectedApp: AppIteration | null) => void }) {
  const [input, setInput] = useState('');
  const [isDimaModalOpen, setIsDimaModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedReqs, setSelectedReqs] = useState<Requirement[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppIteration | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    let finalMessage = input.trim();
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
      onNewSession(finalMessage, selectedApp);
      setInput('');
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

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA]">
      <div className="max-w-3xl w-full px-8 flex flex-col items-center">
        
        <h1 className="text-4xl font-serif text-slate-800 mb-10 tracking-tight">告诉我，今天我们一起创造点什么？</h1>
        
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 transition-all focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 focus-within:shadow-md">
          {(selectedReqs.length > 0 || attachments.length > 0 || selectedApp) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedApp && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  selectedApp.type === 'app' ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}>
                  {selectedApp.type === 'app' ? <Box size={14} /> : <GitBranch size={14} />}
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="告诉我你的研发任务，我来帮你搞定它～"
            className="w-full resize-none outline-none text-lg min-h-[100px] text-slate-700 placeholder:text-slate-400 bg-transparent"
          />
          <div className="flex items-center justify-between mt-2 pt-2">
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
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
              >
                <Plus size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => setIsAppModalOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors"
              >
                {selectedApp ? selectedApp.name : '应用/迭代'} <ChevronDown size={14} className="text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDimaModalOpen(true)}
                className="text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors"
              >
                Dima
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim() && selectedReqs.length === 0 && attachments.length === 0 && !selectedApp}
                className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-3xl flex flex-col gap-2">
          {recommendedReqs.map(req => (
            <div 
              key={req.id}
              onClick={() => handleDimaSelect(req)}
              className="flex items-center gap-3 text-sm cursor-pointer p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-300 transition-all font-medium text-slate-600 group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                req.type === 'bug' ? 'bg-slate-100 text-slate-700 group-hover:bg-slate-200' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
              }`}>
                {req.type === 'bug' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                )}
              </div>
              <span className="group-hover:text-slate-900 transition-colors">{req.title}</span>
            </div>
          ))}
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
