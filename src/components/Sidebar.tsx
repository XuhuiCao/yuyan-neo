import { Archive, ChevronDown, ChevronRight, Box, Package, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Session } from '../types';

export default function Sidebar({ 
  sessions, 
  currentSessionId, 
  onSelectSession,
  onArchiveSession,
  onRenameSession,
  onDeleteSession
}: { 
  sessions: Session[], 
  currentSessionId: string | null, 
  onSelectSession: (id: string) => void,
  onArchiveSession: (id: string) => void,
  onRenameSession: (id: string) => void,
  onDeleteSession: (id: string) => void
}) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ '已归档': false });
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: prev[group] === false ? true : false }));
  };

  // Grouping logic
  const activeTasks = sessions.filter(s => !s.isArchived);
  const archivedTasks = sessions.filter(s => s.isArchived);

  const appGroups = activeTasks.reduce((acc, task) => {
    const appName = task.appName || '未分组';
    if (!acc[appName]) acc[appName] = [];
    acc[appName].push(task);
    return acc;
  }, {} as Record<string, Session[]>);

  const sortedAppNames = Object.keys(appGroups).sort((a, b) => {
    if (a === '未分组') return 1;
    if (b === '未分组') return -1;
    return a.localeCompare(b);
  });

  const renderTask = (session: Session) => (
    <div 
      key={session.id}
      onClick={() => onSelectSession(session.id)}
      className={`group p-2 -mx-2 rounded-lg cursor-pointer mb-1 transition-colors relative ${currentSessionId === session.id ? 'bg-slate-200' : 'hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-2 mb-1 pr-6">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0
          ${session.status === '进行中' ? 'bg-blue-500' : 
            session.status === '已完结' ? 'bg-green-500' : 
            session.status === '已取消' ? 'bg-slate-400' :
            session.status === '待操作' ? 'bg-yellow-500' :
            session.status === '有异常' ? 'bg-red-500' :
            'bg-slate-400'}`} 
        />
        <div className="text-sm font-medium text-slate-800 truncate">{session.title}</div>
      </div>
      <div className="flex items-center justify-between pl-3.5">
        <div className="text-[10px] text-slate-400">{session.time}</div>
      </div>
      {!session.isArchived && (
        <div className="absolute top-2 right-2 hidden group-hover:block">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(openDropdownId === session.id ? null : session.id);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
          >
            <MoreVertical size={16} />
          </button>
          {openDropdownId === session.id && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
              <div className="absolute right-0 top-7 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-20 py-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRenameSession(session.id);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 size={14} /> 重命名
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchiveSession(session.id);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Archive size={14} /> 归档
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                    setOpenDropdownId(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4">
        <button 
          onClick={() => onSelectSession('')}
          className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          新任务
        </button>
      </div>
      
      <div className="h-px bg-slate-100 mx-4 mb-2" />
      
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {sortedAppNames.map(appName => {
          const isExpanded = expandedGroups[appName] !== false; // default true
          return (
            <div key={appName} className="mb-4">
              <div 
                className="flex items-center gap-2 text-sm font-medium text-slate-700 py-1.5 cursor-pointer hover:bg-slate-50 rounded px-2 -mx-2 mb-1"
                onClick={() => toggleGroup(appName)}
              >
                {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                {appName === '未分组' ? (
                  <Package size={14} className="text-slate-400" />
                ) : (
                  <Box size={14} className="text-slate-800" />
                )}
                {appName}
              </div>
              {isExpanded && (
                <div className="pl-2">
                  {appGroups[appName].map(renderTask)}
                </div>
              )}
            </div>
          );
        })}

        {archivedTasks.length > 0 && (
          <>
            <div className="h-px bg-slate-100 my-4" />
            <div className="mb-4">
              <div 
                className="flex items-center gap-2 text-sm font-medium text-slate-700 py-1.5 cursor-pointer hover:bg-slate-50 rounded px-2 -mx-2 mb-1"
                onClick={() => toggleGroup('已归档')}
              >
                {expandedGroups['已归档'] !== false ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                <Archive size={14} className="text-slate-400" />
                已归档
              </div>
              {expandedGroups['已归档'] !== false && (
                <div className="pl-2">
                  {archivedTasks.map(renderTask)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
