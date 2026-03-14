import { Check } from 'lucide-react';

export default function SandboxDetails({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <span className="text-slate-800 font-bold">沙箱环境详情</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">已就绪</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">环境名称</span>
          <span className="text-slate-700 font-mono text-[10px]">sandbox-v1</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">容器状态</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700">运行中</span>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-50 space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 uppercase tracking-tighter">环境准备进度</span>
            <span className="text-slate-600 font-bold">100%</span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald-500 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2">
            <div className="flex items-center gap-1.5">
              <Check size={10} className="text-emerald-500" />
              <span className="text-slate-500 text-[10px]">容器启动</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={10} className="text-emerald-500" />
              <span className="text-slate-500 text-[10px]">网络配置</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={10} className="text-emerald-500" />
              <span className="text-slate-500 text-[10px]">依赖安装</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={10} className="text-emerald-500" />
              <span className="text-slate-500 text-[10px]">数据库连接</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
