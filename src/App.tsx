import React, { useState, useEffect } from 'react';
import { NavigationTab, SensorProbe, SoilMetrics, ProtocolAction, NotificationItem } from './types/telemetry';
import {
  INITIAL_PROBES,
  INITIAL_STRATA_LAYERS,
  INITIAL_METRICS,
  INITIAL_PROTOCOL_ACTIONS,
  INITIAL_NOTIFICATIONS,
} from './data/mockTelemetry';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SoilLabView } from './components/SoilLabView';
import { CommandCenterView } from './components/CommandCenterView';
import { WaterCenterView } from './components/WaterCenterView';
import { AIDoctorView } from './components/AIDoctorView';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('soil-lab');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Live Telemetry States
  const [probes, setProbes] = useState<SensorProbe[]>(INITIAL_PROBES);
  const [metrics, setMetrics] = useState<SoilMetrics>(INITIAL_METRICS);
  const [strataLayers, setStrataLayers] = useState(INITIAL_STRATA_LAYERS);
  const [protocolActions, setProtocolActions] = useState<ProtocolAction[]>(INITIAL_PROTOCOL_ACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [protocolLogged, setProtocolLogged] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState('strata-rhizo');

  // Header Counters & Connectivity
  const [gardenHealth] = useState(87);
  const [reservoirLevel] = useState(78);
  const [mqttLatency, setMqttLatency] = useState(24);
  const [meshConnected] = useState(true);
  const [syncSeconds, setSyncSeconds] = useState(12);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pollingIntervalMs, setPollingIntervalMs] = useState(500);

  // Sync Timer Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSeconds(prev => (prev < 60 ? prev + 1 : 1));
      // Subtle MQTT latency micro-jitter (22-26ms)
      setMqttLatency(22 + Math.floor(Math.random() * 5));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Force Manual Sync
  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncSeconds(1);
      setIsSyncing(false);
    }, 900);
  };

  // Re-Zero Sensor Drift
  const handleReZeroProbes = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProbes(prev =>
          prev.map(p => ({
            ...p,
            drift: 0.0,
            driftText: '0.0% (Zeroed)',
          }))
        );
        // Add notification
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setNotifications(prev => [
          {
            id: `cal-${Date.now()}`,
            title: 'ESP32 Calibration Re-Zeroed',
            description: 'Capacitive plates zeroed across node array alpha. Calibration drift: 0.00%.',
            level: 'success',
            timestamp: now,
            read: false,
          },
          ...prev,
        ]);
        resolve();
      }, 1200);
    });
  };

  const handleUpdateMetrics = (newMetrics: Partial<SoilMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  };

  const handleToggleProtocolAction = (id: number) => {
    setProtocolActions(prev =>
      prev.map(a => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleLogProtocol = () => {
    setProtocolLogged(true);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [
      {
        id: `proto-${Date.now()}`,
        title: 'Protocol PRT-TOM-2025-04 Logged',
        description: 'Kelp & blood meal application confirmed. Scheduled re-test logged for Friday 08:00 AM.',
        level: 'success',
        timestamp: now,
        read: false,
      },
      ...prev,
    ]);
  };

  const handleDismissProtocol = () => {
    setProtocolLogged(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        mqttLatency={mqttLatency}
        meshConnected={meshConnected}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onToggleMobileMenu={() => setIsOpenMobile(!isOpenMobile)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          unreadCount={unreadCount}
          gardenHealth={gardenHealth}
          reservoirLevel={reservoirLevel}
          syncTime={`${syncSeconds}s ago`}
          isSyncing={isSyncing}
          onManualSync={handleManualSync}
        />

        {/* Primary Page Canvas */}
        <main className="flex-1 w-full pt-16 px-4 sm:px-6 md:px-margin bg-surface">
          {currentTab === 'soil-lab' && (
            <SoilLabView
              probes={probes}
              strataLayers={strataLayers}
              metrics={metrics}
              onUpdateMetrics={handleUpdateMetrics}
              onReZeroProbes={handleReZeroProbes}
              protocolActions={protocolActions}
              onToggleProtocolAction={handleToggleProtocolAction}
              onLogProtocol={handleLogProtocol}
              onDismissProtocol={handleDismissProtocol}
              protocolLogged={protocolLogged}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
            />
          )}

          {currentTab === 'command-center' && <CommandCenterView />}

          {currentTab === 'water-center' && <WaterCenterView />}

          {currentTab === 'ai-doctor' && <AIDoctorView />}

          {currentTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
      />

      {/* Calibration & Node Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pollingIntervalMs={pollingIntervalMs}
        onChangePollingInterval={setPollingIntervalMs}
      />
    </div>
  );
}
