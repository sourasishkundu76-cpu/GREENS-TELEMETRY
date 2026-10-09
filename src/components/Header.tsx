import React from 'react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  unreadCount: number;
  gardenHealth: number;
  reservoirLevel: number;
  syncTime: string;
  isSyncing: boolean;
  onManualSync: () => void;
}

const AVATAR_SRC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7CgR9fnhI2I7W_Qb41gnGorROJM-IUubPxdYw3QEp0FvNYklIxJJfjQ3OsuhzWy-TvSZuO6JPDrm6Yz0gqDY93SjigBpeqsa_pJivgZpE8Pyv6Q-33vJpe6MaAgA3lPSjzGGryLraRaQsy16b7sPBO5WItzciTcYbajJc3OUDaZW4Cf2-JQyvYbs_ywntRiupF1pH7bhS17YHgCM6TFHHIOGj8wqEqoG2QB4_pjFKNl0lhy7QYWiT';

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onOpenNotifications,
  onOpenSettings,
  unreadCount,
  gardenHealth,
  reservoirLevel,
  syncTime,
  isSyncing,
  onManualSync,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 md:px-space-lg">
      {/* Left side: Mobile Toggle & Global Telemetry Badges */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-space-lg">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Garden Health Badge */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/30">
          <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant text-[10px] sm:text-[11px]">
            Garden Health
          </span>
          <span className="font-code-sm text-code-sm text-primary font-bold tabular-nums">
            {gardenHealth}%
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Reservoir Badge */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/30">
          <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant text-[10px] sm:text-[11px]">
            Reservoir
          </span>
          <span className="font-code-sm text-code-sm text-secondary font-bold tabular-nums">
            {reservoirLevel}%
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        </div>

        {/* Cloud Sync with Trigger */}
        <button
          onClick={onManualSync}
          title="Click to force cloud sync"
          className="hidden md:flex items-center gap-space-sm bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/30 hover:border-tertiary/50 transition-colors cursor-pointer group"
        >
          <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant text-[11px]">
            Cloud Sync
          </span>
          <span className="font-code-sm text-code-sm text-tertiary font-bold">
            {isSyncing ? 'Syncing...' : syncTime}
          </span>
          <span
            className={`material-symbols-outlined text-xs text-tertiary group-hover:rotate-180 transition-transform ${
              isSyncing ? 'animate-spin' : ''
            }`}
          >
            sync
          </span>
        </button>
      </div>

      {/* Right side: Alerts, Calibration & Agronomist Identity */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        <div className="flex items-center gap-1 sm:gap-space-xs">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          {/* Quick Hardware Tune Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer"
            aria-label="Sensor Calibration Settings"
            title="Sensor Settings & Node Calibration"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>

        {/* Doctor Identity */}
        <div className="flex items-center gap-space-sm pl-2 sm:pl-space-sm border-l border-outline-variant/30">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-title-sm text-body-md text-on-surface font-semibold leading-tight">
              Dr. A. Thorne
            </span>
            <span className="font-telemetry-label text-telemetry-label uppercase text-primary text-[10px]">
              Agronomist
            </span>
          </div>
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/40 bg-surface-container-high">
            <img
              alt="Profile of Dr. A. Thorne"
              className="w-full h-full object-cover"
              src={AVATAR_SRC}
              onError={(e) => {
                // Fallback avatar if external image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-primary bg-surface-container-high">
              AT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
