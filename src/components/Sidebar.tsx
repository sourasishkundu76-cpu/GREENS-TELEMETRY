import React from 'react';
import { NavigationTab } from '../types/telemetry';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  mqttLatency: number;
  meshConnected: boolean;
}

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1W90PxI8L5MeKDigL2Nnh9g6qAN2vZqGWrAsHOrMpHZcR7GzfzSQQvcE6GGBYR-3l--8XMfkL3WwjIC9joLl3j5j5xQ4EgaDFAddkONYMgLC1bIO3c4fFwYr5tCdxbyaO5h7fGH47ikmc2-KGIzDlokaU3cOljkRlcJ7YJLAuU_d7ZKWyXeccZA1YwSnW9cnhHgm3zQZJAPfyG6W0V9SH3Tran1NuEHDOU2ufkYHFkzPZR0ps79556uEfU';

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  mqttLatency,
  meshConnected,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'command-center', label: 'Command Center', icon: 'dashboard' },
    { id: 'soil-lab', label: 'Soil Lab', icon: 'psychiatry' },
    { id: 'water-center', label: 'Water Center', icon: 'water_drop' },
    { id: 'ai-doctor', label: 'AI Doctor', icon: 'vital_signs' },
    { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-space-md transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-space-md px-space-md">
          {/* Brand Emblem Lockup */}
          <div className="flex items-center gap-space-sm px-space-xs py-space-xs">
            <div className="relative h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-surface-container-lowest overflow-hidden">
              <img
                alt="Green Guardians Bio-IoT Emblem"
                className="h-8 w-auto object-contain"
                src={LOGO_SRC}
                onError={(e) => {
                  // Fallback emblem if network blocked
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-primary text-xl fallback-icon">
                eco
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md tracking-tight uppercase text-primary leading-none text-[20px]">
                GREEN GUARDIANS
              </span>
              <span className="font-telemetry-label uppercase tracking-widest text-on-surface-variant text-[11px] mt-0.5">
                Bio-Telemetry OS
              </span>
            </div>
          </div>

          {/* Realtime ESP32 Mesh Status Box */}
          <div className="flex flex-col gap-space-xs bg-surface-container-lowest rounded-lg p-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between font-telemetry-label text-telemetry-label">
              <span className="flex items-center gap-space-xs text-on-surface-variant">
                <span
                  className={`w-2 h-2 rounded-full ${
                    meshConnected ? 'bg-primary animate-pulse' : 'bg-error'
                  }`}
                />
                ESP32 MESH
              </span>
              <span className="text-primary font-code-sm text-code-sm font-semibold">
                {meshConnected ? 'ONLINE' : 'RECONNECTING'}
              </span>
            </div>
            <div className="flex items-center justify-between font-telemetry-label text-telemetry-label">
              <span className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                MQTT LATENCY
              </span>
              <span className="text-secondary font-code-sm text-code-sm font-semibold tabular-nums">
                {mqttLatency}ms
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 pt-space-xs">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-title-sm font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${isActive ? 'text-on-primary-container' : 'text-primary'}`}>
                    {item.icon}
                  </span>
                  <span className="font-body-md text-[14px]">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary-container" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Mission Statement & System Revision */}
        <div className="px-space-md flex flex-col gap-space-xs">
          <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-space-xs border border-outline-variant/30">
            <span className="font-telemetry-label text-telemetry-label uppercase text-on-surface-variant">
              Platform Mission
            </span>
            <p className="font-body-sm text-body-sm text-tertiary-fixed-dim leading-snug">
              Sense. Understand. Protect. Grow.
            </p>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant px-space-xs pt-space-xs">
            <span className="font-code-sm text-code-sm text-outline">
              SYS_REV: v2.4.8-bio
            </span>
            <span className="material-symbols-outlined text-sm text-outline">
              terminal
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
