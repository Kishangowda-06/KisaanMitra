import React from 'react';
import { X, CheckCheck, Bell, ShoppingBag, Sparkles, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveView
  } = useApp();

  if (!notificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Farm Alerts & Updates</h3>
                <p className="text-xs text-slate-500">Live order & crop advisory notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllNotificationsRead}
                className="p-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:bg-emerald-50 rounded-lg flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
              <button
                onClick={() => setNotificationDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">All caught up!</h4>
                <p className="text-xs text-slate-400 mt-1">No new agricultural alerts right now.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.link === 'orders') setActiveView('customer-orders');
                    if (notif.link === 'ai') setActiveView('ai-assistant');
                    if (notif.link === 'marketplace') setActiveView('marketplace');
                    setNotificationDrawerOpen(false);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-white border-slate-100 text-slate-600'
                      : 'bg-emerald-50/60 border-emerald-200/80 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'order' && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                      {notif.type === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                      {notif.type === 'product' && (
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                      {notif.type === 'system' && (
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
