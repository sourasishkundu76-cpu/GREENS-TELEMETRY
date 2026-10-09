import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollingIntervalMs: number;
  onChangePollingInterval: (ms: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  pollingIntervalMs,
  onChangePollingInterval,
}) => {
  const [meshSsid, setMeshSsid] = useState('ESP32_AGRO_MESH_ALPHA');
  const [mqttBroker, setMqttBroker] = useState('mqtt://broker.greenguardians.bio:8883');
  const [targetVwcMin, setTargetVwcMin] = useState(70);
  const [targetVwcMax, setTargetVwcMax] = useState(85);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="bg-surface-container-low border border-primary/30 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-2xl">tune</span>
          <h3 className="font-title-sm text-on-surface text-lg">
            Hardware & Calibration Settings
          </h3>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Polling Interval */}
          <div className="flex flex-col gap-1.5">
            <label className="font-code-sm uppercase text-on-surface-variant">
              ESP32 Bus Polling Interval:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 1000].map((interval) => (
                <button
                  key={interval}
                  onClick={() => onChangePollingInterval(interval)}
                  className={`p-2 rounded font-code-sm border transition-colors cursor-pointer ${
                    pollingIntervalMs === interval
                      ? 'bg-primary text-on-primary font-bold border-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
                  }`}
                >
                  {interval} ms
                </button>
              ))}
            </div>
          </div>

          {/* MQTT Broker URL */}
          <div className="flex flex-col gap-1.5">
            <label className="font-code-sm uppercase text-on-surface-variant">
              MQTT Broker Endpoint (TLS / WSS):
            </label>
            <input
              type="text"
              value={mqttBroker}
              onChange={(e) => setMqttBroker(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded p-2 text-on-surface font-code-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Mesh SSID */}
          <div className="flex flex-col gap-1.5">
            <label className="font-code-sm uppercase text-on-surface-variant">
              Hardware Mesh Node Array ID:
            </label>
            <input
              type="text"
              value={meshSsid}
              onChange={(e) => setMeshSsid(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded p-2 text-on-surface font-code-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Volumetric Target Bounds */}
          <div className="flex flex-col gap-1.5">
            <label className="font-code-sm uppercase text-on-surface-variant">
              Target Rhizosphere VWC Range (%):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-outline block">MIN LOWER THRESHOLD</span>
                <input
                  type="number"
                  value={targetVwcMin}
                  onChange={(e) => setTargetVwcMin(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded p-1.5 text-on-surface font-code-sm"
                />
              </div>
              <div>
                <span className="text-[10px] text-outline block">MAX SATURATION THRESHOLD</span>
                <input
                  type="number"
                  value={targetVwcMax}
                  onChange={(e) => setTargetVwcMax(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded p-1.5 text-on-surface font-code-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-container-high text-on-surface hover:bg-surface-variant cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:shadow-[0_0_15px_rgba(78,222,163,0.3)] transition-all cursor-pointer font-code-sm"
          >
            {saved ? 'Saved!' : 'Save & Sync Hardware'}
          </button>
        </div>
      </div>
    </div>
  );
};
