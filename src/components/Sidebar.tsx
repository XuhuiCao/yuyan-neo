import { Archive, ChevronDown, ChevronRight, Box, Package, Edit2, Trash2, MoreVertical, Search, Loader2, Pin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Session } from '../types';

const DEFAULT_GROUP_LIMIT = 5;
const DEFAULT_VISIBLE_GROUPS = 10;

export default function Sidebar({ 
  sessions, 
  currentSessionId, 
  onSelectSession,
  onArchiveSession,
  onRenameSession,
  onDeleteSession,
  onPinSession
}: { 
  sessions: Session[], 
  currentSessionId: string | null, 
  onSelectSession: (id: string) => void,
  onArchiveSession: (id: string) => void,
  onRenameSession: (id: string, newTitle: string) => void,
  onDeleteSession: (id: string) => void,
  onPinSession: (id: string) => void
}) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ '已归档': false });
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [groupLimits, setGroupLimits] = useState<Record<string, number>>({});
  const [visibleGroupsCount, setVisibleGroupsCount] = useState(DEFAULT_VISIBLE_GROUPS);
  const activeSessionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Expand groups with matches when searching
  useEffect(() => {
    if (debouncedQuery) {
      const newExpanded: Record<string, boolean> = { '已归档': true, '置顶': true };
      sessions.forEach(s => {
        const groupName = s.isArchived ? '已归档' : (s.isPinned ? '置顶' : (s.appName || '未分组'));
        newExpanded[groupName] = true;
      });
      setExpandedGroups(prev => ({ ...prev, ...newExpanded }));
    }
  }, [debouncedQuery, sessions]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: prev[group] === false ? true : false }));
  };

  // Grouping logic
  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
    (s.appName && s.appName.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  const activeTasks = filteredSessions.filter(s => !s.isArchived);
  const archivedTasks = filteredSessions.filter(s => s.isArchived);

  const pinnedTasks = activeTasks.filter(s => s.isPinned);
  const unpinnedTasks = activeTasks.filter(s => !s.isPinned);

  const appGroups = unpinnedTasks.reduce((acc, task) => {
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

  // Locate current task
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        const groupName = session.isArchived ? '已归档' : (session.isPinned ? '置顶' : (session.appName || '未分组'));
        
        setExpandedGroups(prev => ({ ...prev, [groupName]: true }));

        const allGroupTasks = session.isArchived 
          ? sessions.filter(s => s.isArchived)
          : (session.isPinned 
              ? sessions.filter(s => !s.isArchived && s.isPinned)
              : sessions.filter(s => !s.isArchived && !s.isPinned && (s.appName || '未分组') === groupName));
          
        const sessionIndex = allGroupTasks.findIndex(s => s.id === currentSessionId);
        
        if (sessionIndex !== -1) {
          setGroupLimits(prev => {
            const currentLimit = prev[groupName] || DEFAULT_GROUP_LIMIT;
            if (sessionIndex >= currentLimit) {
              const newLimit = Math.ceil((sessionIndex + 1) / DEFAULT_GROUP_LIMIT) * DEFAULT_GROUP_LIMIT;
              return { ...prev, [groupName]: newLimit };
            }
            return prev;
          });
        }

        // Expand visible groups count if the current group is beyond the visible range
        const groupIndex = sortedAppNames.indexOf(groupName);
        if (groupIndex >= visibleGroupsCount) {
          setVisibleGroupsCount(Math.ceil((groupIndex + 1) / DEFAULT_VISIBLE_GROUPS) * DEFAULT_VISIBLE_GROUPS);
        }

        setTimeout(() => {
          activeSessionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [currentSessionId, sessions.length]);

  const handleRenameSubmit = (id: string) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const renderTask = (session: Session) => {
    const isActive = currentSessionId === session.id;
    return (
      <div 
        key={session.id}
        ref={isActive ? activeSessionRef : null}
        onClick={() => {
        if (editingSessionId !== session.id) {
          onSelectSession(session.id);
        }
      }}
      className={`group p-2 -mx-2 rounded-lg cursor-pointer mb-1 transition-colors relative ${currentSessionId === session.id ? 'bg-slate-200' : 'hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-2 mb-1 pr-12">
        {session.isPinned && (
          <Pin size={12} className="text-blue-500 shrink-0 fill-blue-500" />
        )}
        {editingSessionId === session.id ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => handleRenameSubmit(session.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameSubmit(session.id);
              } else if (e.key === 'Escape') {
                setEditingSessionId(null);
              }
            }}
            autoFocus
            className="text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded px-1 w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-sm font-medium text-slate-800 truncate">{session.title}</div>
        )}
      </div>
      <div className="flex items-center justify-between pl-1">
        <div className="text-[10px] text-slate-400">{session.time}</div>
      </div>
      {!session.isArchived && editingSessionId !== session.id && (
        <div className={`absolute top-2 right-2 ${openDropdownId === session.id ? 'flex' : 'hidden group-hover:flex'} items-center gap-0.5 bg-slate-50 rounded-md shadow-sm border border-slate-200 p-0.5 z-10`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPinSession(session.id);
            }}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title={session.isPinned ? "取消置顶" : "置顶"}
          >
            <Pin size={14} className={session.isPinned ? "fill-blue-600 text-blue-600" : ""} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(openDropdownId === session.id ? null : session.id);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
          >
            <MoreVertical size={14} />
          </button>
          {openDropdownId === session.id && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} />
              <div className="absolute right-0 top-7 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-20 py-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTitle(session.title);
                    setEditingSessionId(session.id);
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
  };

  const renderGroup = (groupName: string, tasks: Session[], icon: React.ReactNode) => {
    if (tasks.length === 0) return null;
    
    const isExpanded = expandedGroups[groupName] !== false; // default true
    // If searching, show all matches in the group, otherwise use the limit
    const limit = debouncedQuery ? tasks.length : (groupLimits[groupName] || DEFAULT_GROUP_LIMIT);
    const visibleTasks = tasks.slice(0, limit);
    const hasMore = tasks.length > limit;

    return (
      <div key={groupName} className="mb-4">
        <div 
          className="flex items-center gap-2 text-sm font-medium text-slate-700 py-1.5 cursor-pointer hover:bg-slate-50 rounded px-2 -mx-2 mb-1 sticky top-0 bg-white z-10"
          onClick={() => toggleGroup(groupName)}
        >
          {isExpanded ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
          {icon}
          <span className="flex-1 truncate">{groupName}</span>
          <span className="text-xs text-slate-400 font-normal">{tasks.length}</span>
        </div>
        {isExpanded && (
          <div className="pl-2">
            {visibleTasks.map(renderTask)}
            {hasMore && (
              <div 
                className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer py-2 flex items-center justify-center gap-1 mt-1 rounded hover:bg-slate-50 transition-colors"
                onClick={() => {
                  setGroupLimits(prev => ({
                    ...prev,
                    [groupName]: (prev[groupName] || DEFAULT_GROUP_LIMIT) + DEFAULT_GROUP_LIMIT
                  }));
                }}
              >
                <ChevronDown size={14} />
                展开更多 ({tasks.length - limit})
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="animate-pulse px-2 mt-2">
      {[1, 2, 3].map(group => (
        <div key={group} className="mb-6">
          <div className="h-5 bg-slate-100 rounded w-24 mb-3"></div>
          {[1, 2, 3].map(item => (
            <div key={item} className="mb-3 p-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-slate-100 rounded-full shrink-0"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-1/3 ml-4"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const visibleAppNames = debouncedQuery ? sortedAppNames : sortedAppNames.slice(0, visibleGroupsCount);
  const hasMoreGroups = !debouncedQuery && sortedAppNames.length > visibleGroupsCount;

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4 flex flex-col gap-3">
        <button 
          onClick={() => onSelectSession('')}
          className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          新任务
        </button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索任务或应用..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      
      <div className="h-px bg-slate-100 mx-4 mb-2" />
      
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {isSearching ? (
          renderSkeleton()
        ) : (
          <>
            {sortedAppNames.length === 0 && activeTasks.length === 0 && archivedTasks.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                没有找到匹配的任务
              </div>
            )}
            
            {pinnedTasks.length > 0 && (
              <>
                {renderGroup('置顶', pinnedTasks, <Pin size={14} className="text-blue-500 shrink-0 fill-blue-500" />)}
                <div className="h-px bg-slate-100 my-4" />
              </>
            )}

            {visibleAppNames.map(appName => 
              renderGroup(
                appName, 
                appGroups[appName], 
                appName === '未分组' ? <Package size={14} className="text-slate-400 shrink-0" /> : <Box size={14} className="text-slate-800 shrink-0" />
              )
            )}

            {hasMoreGroups && (
              <div className="py-2 flex justify-center mb-4">
                <button 
                  onClick={() => setVisibleGroupsCount(prev => prev + DEFAULT_VISIBLE_GROUPS)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  加载更多分组 ({sortedAppNames.length - visibleGroupsCount})
                </button>
              </div>
            )}

            {archivedTasks.length > 0 && (
              <>
                <div className="h-px bg-slate-100 my-4" />
                {renderGroup('已归档', archivedTasks, <Archive size={14} className="text-slate-400 shrink-0" />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
