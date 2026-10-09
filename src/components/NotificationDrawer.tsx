import React from 'react';
import { NotificationItem } from '../types/telemetry';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-surface-container-low h-full border-l border-outline-variant/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">notifications</span>
            <h3 className="font-title-sm text-on-surface">Bio-Telemetry Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-surface-container-lowest border-b border-outline-variant/20 flex justify-between text-xs font-code-sm">
          <button
            onClick={onMarkAllAsRead}
            className="text-primary hover:underline cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={onClearAll}
            className="text-on-surface-variant hover:text-error cursor-pointer"
          >
            Clear log
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-2 text-outline">check_circle</span>
              <span className="text-sm">Zero critical telemetry warnings.</span>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.level === 'warning'
                    ? 'bg-error-container/10 border-error/40'
                    : item.level === 'success'
                    ? 'bg-primary-container/10 border-primary/40'
                    : 'bg-surface-container-lowest border-outline-variant/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.level === 'warning'
                          ? 'bg-error'
                          : item.level === 'success'
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    />
                    <h4 className="font-title-sm text-sm text-on-surface font-semibold">
                      {item.title}
                    </h4>
                  </div>
                  <span className="font-code-sm text-[10px] text-outline shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
