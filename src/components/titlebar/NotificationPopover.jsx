import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  ListTodo
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

// Helper to format relative time in Vietnamese
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Icon mapper for notification types
function getNotificationIcon(type) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-rose-400" />;
    case 'system':
    case 'update':
      return <Sparkles className="w-4 h-4 text-purple-400" />;
    case 'todo':
      return <ListTodo className="w-4 h-4 text-blue-400" />;
    case 'info':
    default:
      return <Info className="w-4 h-4 text-sky-400" />;
  }
}

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notification'); // 'notification' | 'todo'
  const popoverRef = useRef(null);

  const {
    notificationsOnly = [],
    todosOnly = [],
    unreadNotificationsCount = 0,
    unreadTodosCount = 0,
    totalUnreadCount = 0,
    isLoading = false,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useBrowser();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeItems = activeTab === 'notification' ? notificationsOnly : todosOnly;
  const currentTabUnread = activeTab === 'notification' ? unreadNotificationsCount : unreadTodosCount;

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-1.5 rounded-md transition-colors relative flex items-center justify-center ${
          isOpen
            ? 'bg-blue-600/20 text-blue-400'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title="Thông báo & Việc cần làm"
      >
        <Bell className="w-4 h-4" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200 border-2 border-slate-900 shadow-sm">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Trung tâm thông báo</span>
              {totalUnreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                  {totalUnreadCount} mới
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchNotifications()}
                disabled={isLoading}
                title="Làm mới"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              {currentTabUnread > 0 && (
                <button
                  onClick={() => markAllAsRead(activeTab)}
                  title="Đánh dấu tất cả đã đọc"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 px-2 py-1 rounded transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">Đã đọc tất cả</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-3 pt-1.5 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('notification')}
              className={`pb-2 px-2.5 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'notification'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Thông báo</span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('todo')}
              className={`pb-2 px-2.5 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'todo'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Cần làm</span>
              {unreadTodosCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {unreadTodosCount}
                </span>
              )}
            </button>
          </div>

          {/* List Content */}
          <div className="overflow-y-auto divide-y divide-slate-800/40 max-h-[380px] custom-scrollbar">
            {activeItems.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 text-slate-500">
                  {activeTab === 'notification' ? <Bell className="w-6 h-6" /> : <ListTodo className="w-6 h-6" />}
                </div>
                <p className="text-xs font-medium text-slate-300">
                  {activeTab === 'notification' ? 'Không có thông báo nào' : 'Không có việc cần làm'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                  {activeTab === 'notification' 
                    ? 'Bạn đã cập nhật mọi thông tin mới nhất từ hệ thống.' 
                    : 'Tất cả công việc và nhiệm vụ hiện tại đã hoàn tất.'}
                </p>
              </div>
            ) : (
              activeItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className="p-3 hover:bg-slate-800/50 transition-all cursor-pointer flex gap-3 relative group"
                >

                  {/* Icon */}
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-sm">
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <h4 className={`text-xs leading-snug line-clamp-1 ${
                        !item.isRead ? 'font-semibold text-white' : 'font-normal text-slate-300'
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Action link if available */}
                    {item.action_url && (
                      <div className="mt-2">
                        <a
                          href={item.action_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          <span>{item.action_text || 'Xem chi tiết'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-950/60 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <span>Đồng bộ máy chủ tự động</span>
          </div>
        </div>
      )}
    </div>
  );
}
