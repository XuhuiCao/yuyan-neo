import { Search, Plus, Bell, HelpCircle } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-8 h-full">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22L12 18L22 22L12 2Z" fill="currentColor" />
          </svg>
          雨燕
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 h-full">
          <a href="#" className="hover:text-slate-900 h-full flex items-center">工作台</a>
          <a href="#" className="text-slate-900 border-b-2 border-slate-900 h-full flex items-center">智能研发</a>
          <a href="#" className="hover:text-slate-900 h-full flex items-center">任务市场</a>
          <a href="#" className="hover:text-slate-900 h-full flex items-center">燕说</a>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="搜索" 
            className="w-64 h-8 bg-slate-100 rounded-md pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          <div className="absolute right-2 top-1.5 text-slate-400 text-xs border border-slate-300 rounded px-1">/</div>
        </div>
        <button className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800">
          <Plus size={16} />
        </button>
        <button className="text-slate-500 hover:text-slate-700"><Bell size={18} /></button>
        <button className="text-slate-500 hover:text-slate-700"><HelpCircle size={18} /></button>
        <div className="flex items-center gap-2 text-sm text-slate-600 border-l border-slate-200 pl-4">
          <span>主站_sit</span>
          <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </div>
    </header>
  );
}
