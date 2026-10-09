import React, { useState } from 'react';
import { SensorProbe, SoilStrataLayer, CropProfile, SoilMetrics, ProtocolAction } from '../types/telemetry';
import { CROPS } from '../data/mockTelemetry';

interface SoilLabViewProps {
  probes: SensorProbe[];
  strataLayers: SoilStrataLayer[];
  metrics: SoilMetrics;
  onUpdateMetrics: (newMetrics: Partial<SoilMetrics>) => void;
  onReZeroProbes: () => Promise<void>;
  protocolActions: ProtocolAction[];
  onToggleProtocolAction: (id: number) => void;
  onLogProtocol: () => void;
  onDismissProtocol: () => void;
  protocolLogged: boolean;
  selectedLayerId: string;
  onSelectLayer: (layerId: string) => void;
}

const STRATA_BG_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXpxAq0kttEpgQEbGhl1G0lt7fF8-ETWd5ab6ZN-hgWtvnthgr2wFbCCTdOQo5OCR43EN5sAPw_gzkzaTJ3EDg2cBiPq9cgzErgdZaUPCFk9psiOCB62ni4D7-yXmUqu095Sh9cXqGUKrddriZ4tOXSq6nA9T6GxMl7oAthE5RhpbWu4PXm4nAVhj81GhtCW2PjnJdE_Nofm9E_lMS453KlyTC0J21Pw9UX_noPENnC6RvfmJ6PY9C';

export const SoilLabView: React.FC<SoilLabViewProps> = ({
  probes,
  strataLayers,
  metrics,
  onUpdateMetrics,
  onReZeroProbes,
  protocolActions,
  onToggleProtocolAction,
  onLogProtocol,
  onDismissProtocol,
  protocolLogged,
  selectedLayerId,
  onSelectLayer,
}) => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibratedText, setCalibratedText] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropProfile>(CROPS[0]);
  const [activeLayerModal, setActiveLayerModal] = useState<SoilStrataLayer | null>(null);
  const [editingMetrics, setEditingMetrics] = useState(false);

  // Trigger sensor re-zeroing
  const handleReZero = async () => {
    setIsCalibrating(true);
    setCalibratedText(null);
    try {
      await onReZeroProbes();
      setCalibratedText('Zeroed (0.00%)');
      setTimeout(() => {
        setCalibratedText(null);
        setIsCalibrating(false);
      }, 2500);
    } catch {
      setIsCalibrating(false);
    }
  };

  // Generate and download real CSV report
  const handleExportCSV = () => {
    setIsExporting(true);
    const now = new Date().toISOString();
    const rows = [
      ['GREEN GUARDIANS BIO-TELEMETRY OS - SOIL REPORT'],
      ['Timestamp', now],
      ['Firmware', 'v3.12-SOIL'],
      ['Active Crop', `${selectedCrop.commonName} (${selectedCrop.scientificName})`],
      ['Substrate Health Score', '78 / 100'],
      [],
      ['--- HARDWARE NODE TELEMETRY ---'],
      ['Probe ID', 'Name', 'Depth (cm)', 'Battery %', 'Signal RSSI (dBm)', 'Cal Drift', 'VWC %', 'Temp (°C)', 'EC (mS/cm)', 'Status'],
      ...probes.map(p => [
        p.id,
        p.name,
        p.depthCm,
        p.batteryPct,
        p.rssi,
        p.driftText,
        p.vwc,
        p.tempC,
        p.ec,
        p.status,
      ]),
      [],
      ['--- SOIL METRICS BREAKDOWN ---'],
      ['Metric', 'Current Value', 'Status / Target'],
      ['Volumetric Moisture', `${metrics.volumetricMoisture}%`, metrics.moistureTarget],
      ['Acidity / pH Balance', `${metrics.phBalance}% (${metrics.phValue} pH)`, 'Balanced'],
      ['Available Nitrogen (N)', `${metrics.nitrogen}%`, metrics.nitrogenStatus],
      ['Phosphorus (P)', `${metrics.phosphorus}%`, metrics.phosphorusStatus],
      ['Potassium (K)', `${metrics.potassium}%`, metrics.potassiumStatus],
      ['Thermal Stability', `${metrics.thermalStability}%`, metrics.thermalVariance],
      [],
      ['--- REMEDIATION PROTOCOL ---'],
      ['Cycle ID', 'PRT-TOM-2025-04'],
      ['Diagnosis', 'Vegetative Acceleration Depletion'],
      ['Depletion Rate', '2.1 mg/kg/day'],
      ['Safe Margin', '48h'],
      ...protocolActions.map(a => [`Step ${a.id}`, a.title, a.completed ? 'Completed' : 'Pending']),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `green-guardians-soil-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  const currentLayer = strataLayers.find(l => l.id === selectedLayerId) || strataLayers[1];

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Utility Sub-Bar & Breadcrumb Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm pt-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
          <span className="text-primary font-bold">SOIL_LAB_MODULE</span>
          <span>//</span>
          <span>NODE_ARRAY_ALPHA</span>
          <span>//</span>
          <span className="text-tertiary">CAL_SYNCED</span>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Live Sensor Health Tag */}
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-telemetry-label text-telemetry-label text-primary uppercase text-[11px]">
              CAPACITIVE SENSORS 3/3 LIVE
            </span>
          </div>

          {/* Re-Zero Button */}
          <button
            onClick={handleReZero}
            disabled={isCalibrating}
            className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-variant text-primary px-3 py-1.5 rounded-lg font-code-sm text-code-sm transition-all shadow-sm border border-outline-variant/30 cursor-pointer disabled:opacity-50"
            id="re-zero-btn"
          >
            <span className={`material-symbols-outlined text-sm ${isCalibrating ? 'animate-spin' : ''}`}>
              {calibratedText ? 'check' : 'tune'}
            </span>
            <span>
              {isCalibrating
                ? calibratedText || 'Calibrating...'
                : calibratedText || 'Re-Zero Sensors'}
            </span>
          </button>

          {/* Export Soil Report CSV */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-space-xs bg-primary text-on-primary font-title-sm text-body-sm font-semibold px-4 py-1.5 rounded-lg hover:shadow-[0_0_16px_rgba(78,222,163,0.35)] transition-all cursor-pointer"
            id="export-csv-btn"
          >
            <span className={`material-symbols-outlined text-base ${isExporting ? 'animate-bounce' : ''}`}>
              {isExporting ? 'download_done' : 'download'}
            </span>
            <span>{isExporting ? 'Generating CSV...' : 'Export Soil Report CSV'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Block with Typographic Contrast & Score Meter */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 sm:p-space-lg mb-space-lg shadow-xl border border-outline-variant/20 mt-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex items-center gap-space-xs">
              <span className="font-telemetry-label text-telemetry-label uppercase tracking-widest text-primary text-[11px]">
                BIO-TELEMETRIC SUBSTRATE DIAGNOSTICS
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-tertiary font-code-sm text-code-sm text-[11px] border border-outline-variant/40">
                FIRMWARE v3.12-SOIL
              </span>
            </div>
            <h1 className="font-headline-xl text-on-surface tracking-tight mt-1">
              SMART SOIL LAB 🧪
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Your soil, scientifically understood through multi-depth ESP32 capacitive sensors and deep rhizosphere spectroscopy.
            </p>
          </div>

          {/* Quick Substrate Health Score Banner */}
          <div className="flex items-center gap-space-md bg-surface-container-lowest p-4 sm:p-space-md rounded-xl shadow-lg border border-outline-variant/30 shrink-0">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-variant"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-primary transition-all duration-1000"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="78, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-telemetry-metric text-primary leading-none text-[26px]">
                  78
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant leading-none mt-0.5 text-[11px]">
                  /100
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-title-sm text-primary font-bold text-[17px]">
                  GOOD STATUS
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Minor nutrient remediation advised
              </span>
              <span className="font-telemetry-label text-telemetry-label text-secondary mt-1 text-[10px]">
                LAST SWEEP: 2 MIN AGO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-12 gap-gutter mb-space-lg">
        {/* Left Column: 3D Strata Cross-Section & Hardware Telemetry (7 Cols) */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-space-md">
          {/* Interactive Strata & Root Twin Viewer */}
          <div className="relative bg-surface-container-low rounded-xl p-space-md shadow-xl overflow-hidden flex flex-col border border-outline-variant/20">
            {/* Reticle Corners HUD Decor */}
            <span className="absolute top-2 left-2 text-primary/40 font-code-sm text-code-sm select-none">
              +
            </span>
            <span className="absolute top-2 right-2 text-primary/40 font-code-sm text-code-sm select-none">
              +
            </span>
            <span className="absolute bottom-2 left-2 text-primary/40 font-code-sm text-code-sm select-none">
              +
            </span>
            <span className="absolute bottom-2 right-2 text-primary/40 font-code-sm text-code-sm select-none">
              +
            </span>

            {/* Header bar */}
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">
                  biotech
                </span>
                <h2 className="font-title-sm text-title-sm text-on-surface">
                  Digital Plant Twin // Soil Strata Cross-Section
                </h2>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-secondary font-code-sm text-code-sm text-[11px] border border-outline-variant/30">
                  REALTIME HUD
                </span>
                <span className="font-telemetry-label text-telemetry-label text-outline uppercase text-[10px] hidden sm:inline">
                  MOD_01 // MULTI_DEPTH
                </span>
              </div>
            </div>

            {/* 3D Digital Twin Visual Representation */}
            <div className="relative w-full rounded-lg overflow-hidden bg-surface-container-lowest h-[420px] flex flex-col justify-between border border-outline-variant/30">
              {/* Photorealistic Cross Section Image with Resilient Styling */}
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-luminosity hover:opacity-80 transition-opacity duration-700"
                alt="Photorealistic detailed cross section of fertile botanical greenhouse soil showing surface organic humus, vibrant rhizosphere root zone glowing emerald, and mineral subsoil."
                src={STRATA_BG_IMG}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-surface-container-lowest/80 pointer-events-none" />

              {/* Live Root Telemetry HUD Floating Cards */}
              <div className="relative z-10 p-space-sm flex justify-between items-start">
                <div className="flex flex-col gap-1 bg-surface-container/90 backdrop-blur-md p-space-xs px-space-sm rounded-lg shadow-md border border-outline-variant/40">
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant text-[10px]">
                    VASCULAR ABSORPTION
                  </span>
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-telemetry-metric text-title-sm text-primary font-bold">
                      14.6
                    </span>
                    <span className="font-code-sm text-code-sm text-on-surface-variant">
                      mL/hr
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-surface-container/90 backdrop-blur-md p-space-xs px-space-sm rounded-lg shadow-md text-right border border-outline-variant/40">
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant text-[10px]">
                    ROOT CORE TEMP
                  </span>
                  <div className="flex items-baseline justify-end gap-space-xs">
                    <span className="font-telemetry-metric text-title-sm text-secondary font-bold">
                      24.8°C
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Interactive Strata Layer Items */}
              <div className="relative z-10 px-3 sm:px-space-md py-space-sm flex flex-col gap-2 sm:gap-space-md">
                {strataLayers.map((layer) => {
                  const isSelected = selectedLayerId === layer.id;
                  const isRhizo = layer.id === 'strata-rhizo';

                  return (
                    <div
                      key={layer.id}
                      onClick={() => {
                        onSelectLayer(layer.id);
                        setActiveLayerModal(layer);
                      }}
                      className={`group cursor-pointer flex items-center justify-between p-2 sm:p-space-xs px-3 sm:px-space-sm rounded transition-all shadow-sm border ${
                        isSelected
                          ? 'bg-primary-container/25 border-primary/60 backdrop-blur-md shadow-[0_0_15px_rgba(78,222,163,0.15)]'
                          : 'bg-surface-container-high/85 hover:bg-surface-variant border-outline-variant/30 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <span
                          className={`w-2.5 h-2.5 rounded shrink-0 ${
                            isRhizo
                              ? 'bg-primary animate-ping'
                              : layer.id === 'strata-surface'
                              ? 'bg-tertiary'
                              : 'bg-outline'
                          }`}
                        />
                        <div className="flex flex-col">
                          <span
                            className={`font-title-sm text-body-sm font-semibold transition-colors ${
                              isSelected || isRhizo ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                            }`}
                          >
                            {layer.name}
                          </span>
                          <span className="font-telemetry-label text-telemetry-label text-on-surface-variant text-[10px]">
                            {layer.subtitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
                        <span className={`font-code-sm text-code-sm ${isSelected ? 'text-primary font-bold' : 'text-tertiary'}`}>
                          VWC: {layer.vwc}%
                        </span>
                        {layer.ec && (
                          <span className="font-code-sm text-code-sm text-secondary hidden sm:inline">
                            EC: {layer.ec} mS/cm
                          </span>
                        )}
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform text-sm">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom HUD Metrics Ribbon */}
              <div className="relative z-10 bg-surface-container/95 p-space-sm backdrop-blur-md flex items-center justify-around text-center border-t border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant text-[10px]">
                    IONIC CONCENTRATION
                  </span>
                  <span className="font-telemetry-metric text-body-lg text-secondary font-bold">
                    842 ppm
                  </span>
                </div>
                <div className="w-px h-8 bg-surface-variant" />
                <div className="flex flex-col">
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant text-[10px]">
                    RHIZO RESPIRATION
                  </span>
                  <span className="font-telemetry-metric text-body-lg text-primary font-bold">
                    4.2 mg O₂/kg/h
                  </span>
                </div>
                <div className="w-px h-8 bg-surface-variant" />
                <div className="flex flex-col">
                  <span className="font-telemetry-label text-telemetry-label text-on-surface-variant text-[10px]">
                    HYDRAULIC COND.
                  </span>
                  <span className="font-telemetry-metric text-body-lg text-tertiary font-bold">
                    1.24 cm/hr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ESP32 Hardware Node Telemetry & Calibration Terminal */}
          <div className="bg-surface-container-low rounded-xl p-space-md shadow-xl flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">
                  sensors
                </span>
                <h3 className="font-title-sm text-title-sm text-on-surface">
                  ESP32 Hardware Node Telemetry & Calibration
                </h3>
              </div>
              <span className="font-code-sm text-code-sm text-on-surface-variant text-[11px]">
                BUS: I2C_0x48 // POLLING: 500ms
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-lowest text-on-surface-variant font-telemetry-label text-telemetry-label uppercase text-[10px]">
                    <th className="p-space-sm rounded-l">Sensor Probe</th>
                    <th className="p-space-sm">Installed Depth</th>
                    <th className="p-space-sm">Battery</th>
                    <th className="p-space-sm">Signal (RSSI)</th>
                    <th className="p-space-sm">Calibration Drift</th>
                    <th className="p-space-sm rounded-r text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40">
                  {probes.map((probe) => {
                    const isRhizo = probe.id === 'probe-01';
                    return (
                      <tr
                        key={probe.id}
                        className="bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer"
                        onClick={() => {
                          onSelectLayer(
                            probe.id === 'probe-01'
                              ? 'strata-rhizo'
                              : probe.id === 'probe-02'
                              ? 'strata-surface'
                              : 'strata-subsoil'
                          );
                        }}
                      >
                        <td className="p-space-sm font-code-sm text-code-sm text-primary font-bold flex items-center gap-space-xs">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isRhizo ? 'bg-primary' : 'bg-tertiary'
                            }`}
                          />
                          {probe.name}
                        </td>
                        <td className="p-space-sm font-code-sm text-code-sm text-on-surface">
                          {probe.depthCm} cm
                        </td>
                        <td className="p-space-sm font-code-sm text-code-sm text-on-surface">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-primary">
                              {probe.batteryPct > 80
                                ? 'battery_6_bar'
                                : probe.batteryPct > 65
                                ? 'battery_5_bar'
                                : 'battery_4_bar'}
                            </span>
                            <span>{probe.batteryPct}%</span>
                          </div>
                        </td>
                        <td className="p-space-sm font-code-sm text-code-sm text-secondary">
                          {probe.rssi} dBm
                        </td>
                        <td className="p-space-sm font-code-sm text-code-sm text-tertiary">
                          {probe.driftText}
                        </td>
                        <td className="p-space-sm text-right">
                          <span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-primary font-code-sm text-code-sm text-[11px] border border-primary/20">
                            {probe.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown Sliders & Crop Suitability Matrix (5 Cols) */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-space-md">
          {/* Soil Metric Breakdown */}
          <div className="bg-surface-container-low rounded-xl p-space-md shadow-xl flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">
                  tune
                </span>
                <h3 className="font-title-sm text-title-sm text-on-surface">
                  Soil Metric Breakdown
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-code-sm text-code-sm text-primary text-[11px]">
                  6 AXES MONITORED
                </span>
                <button
                  onClick={() => setEditingMetrics(!editingMetrics)}
                  className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors text-xs"
                  title="Toggle metric simulation adjustments"
                >
                  <span className="material-symbols-outlined text-sm">
                    {editingMetrics ? 'check' : 'edit'}
                  </span>
                </button>
              </div>
            </div>

            {/* 6 Metrics Sliders / Telemetry Meters */}
            <div className="flex flex-col gap-space-sm">
              {/* Moisture */}
              <div className="flex flex-col gap-1 bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Volumetric Moisture
                  </span>
                  <span className="font-code-sm text-code-sm text-primary font-bold">
                    {metrics.volumetricMoisture}%{' '}
                    <span className="text-on-surface-variant font-normal text-xs">
                      ({metrics.moistureTarget})
                    </span>
                  </span>
                </div>
                {editingMetrics ? (
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={metrics.volumetricMoisture}
                    onChange={(e) => onUpdateMetrics({ volumetricMoisture: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                ) : (
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.volumetricMoisture}%` }}
                    />
                  </div>
                )}
              </div>

              {/* pH */}
              <div className="flex flex-col gap-1 bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Acidity / pH Balance
                  </span>
                  <span className="font-code-sm text-code-sm text-primary font-bold">
                    {metrics.phBalance}%{' '}
                    <span className="text-tertiary font-normal text-xs">
                      ({metrics.phValue} pH Balanced)
                    </span>
                  </span>
                </div>
                {editingMetrics ? (
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={metrics.phBalance}
                    onChange={(e) => onUpdateMetrics({ phBalance: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                ) : (
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.phBalance}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Nitrogen (Depleted / Low) */}
              <div className="flex flex-col gap-1 bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      Available Nitrogen (N)
                    </span>
                    <span className="material-symbols-outlined text-xs text-error">
                      warning
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-error font-bold">
                    {metrics.nitrogen}%{' '}
                    <span className="text-error font-normal text-xs">
                      ({metrics.nitrogenStatus})
                    </span>
                  </span>
                </div>
                {editingMetrics ? (
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={metrics.nitrogen}
                    onChange={(e) => onUpdateMetrics({ nitrogen: Number(e.target.value) })}
                    className="w-full accent-error"
                  />
                ) : (
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-error h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.nitrogen}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Phosphorus */}
              <div className="flex flex-col gap-1 bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Phosphorus (P)
                  </span>
                  <span className="font-code-sm text-code-sm text-primary font-bold">
                    {metrics.phosphorus}%{' '}
                    <span className="text-on-surface-variant font-normal text-xs">
                      ({metrics.phosphorusStatus})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${metrics.phosphorus}%` }}
                  />
                </div>
              </div>

              {/* Potassium (Low Alert) */}
              <div className="flex flex-col gap-1 bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      Potassium (K)
                    </span>
                    <span className="material-symbols-outlined text-xs text-error">
                      warning
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-error font-bold">
                    {metrics.potassium}%{' '}
                    <span className="text-error font-normal text-xs">
                      ({metrics.potassiumStatus})
                    </span>
                  </span>
                </div>
                {editingMetrics ? (
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={metrics.potassium}
                    onChange={(e) => onUpdateMetrics({ potassium: Number(e.target.value) })}
                    className="w-full accent-error"
                  />
                ) : (
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-error h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.potassium}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Thermal Stability */}
              <div className="flex flex-col gap-1 bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Thermal Stability
                  </span>
                  <span className="font-code-sm text-code-sm text-secondary font-bold">
                    {metrics.thermalStability}%{' '}
                    <span className="text-on-surface-variant font-normal text-xs">
                      ({metrics.thermalVariance})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${metrics.thermalStability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Soil Suitability Matrix for Active Crop Card */}
          <div className="bg-surface-container-low rounded-xl p-space-md shadow-xl flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="text-2xl">{selectedCrop.icon}</span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-title-sm text-title-sm text-on-surface leading-snug">
                      {selectedCrop.commonName} Suitability Matrix
                    </h3>
                    {/* Quick crop selector */}
                    <select
                      value={selectedCrop.id}
                      onChange={(e) => {
                        const crop = CROPS.find(c => c.id === e.target.value);
                        if (crop) setSelectedCrop(crop);
                      }}
                      className="bg-surface-container-highest text-primary font-code-sm text-xs rounded px-1.5 py-0.5 border border-outline-variant/40 cursor-pointer focus:outline-none"
                    >
                      {CROPS.map(c => (
                        <option key={c.id} value={c.id} className="bg-surface text-on-surface">
                          Switch: {c.commonName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="font-code-sm text-code-sm text-tertiary">
                    {selectedCrop.scientificName}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-telemetry-metric text-primary leading-none">
                  {selectedCrop.matchScore}%
                </span>
                <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase text-[10px]">
                  MATCH SCORE
                </span>
              </div>
            </div>

            {/* Matrix Badges */}
            <div className="flex flex-wrap gap-space-xs pt-space-xs">
              <span className="flex items-center gap-1 bg-surface-container-lowest text-primary px-space-sm py-1 rounded-full font-code-sm text-code-sm border border-outline-variant/30 text-[11px]">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                pH Suitable ({metrics.phValue})
              </span>
              <span className="flex items-center gap-1 bg-surface-container-lowest text-primary px-space-sm py-1 rounded-full font-code-sm text-code-sm border border-outline-variant/30 text-[11px]">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Temp Suitable (24.8°C)
              </span>
              <span className="flex items-center gap-1 bg-surface-container-lowest text-primary px-space-sm py-1 rounded-full font-code-sm text-code-sm border border-outline-variant/30 text-[11px]">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Aeration Optimal
              </span>
              <span className="flex items-center gap-1 bg-error-container text-on-error-container px-space-sm py-1 rounded-full font-code-sm text-code-sm font-semibold border border-error/30 text-[11px]">
                <span className="material-symbols-outlined text-sm">warning</span>
                Nitrogen Low ({metrics.nitrogen}%)
              </span>
              <span className="flex items-center gap-1 bg-error-container text-on-error-container px-space-sm py-1 rounded-full font-code-sm text-code-sm font-semibold border border-error/30 text-[11px]">
                <span className="material-symbols-outlined text-sm">warning</span>
                Potassium Low ({metrics.potassium}%)
              </span>
            </div>

            {/* AI Agronomist Synthesis Bubble */}
            <div className="mt-space-xs bg-surface-container-lowest rounded-lg p-space-sm flex gap-space-sm items-start border border-outline-variant/20">
              <div className="p-1 rounded-md bg-secondary/10 text-secondary shrink-0">
                <span className="material-symbols-outlined text-xl">psychology</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-telemetry-label text-telemetry-label text-secondary uppercase text-[10px]">
                  AI AGRONOMIST SYNTHESIS
                </span>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  {selectedCrop.synthesis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Nutrient Improvement Protocol & Crop Action Center (Full Width) */}
      <section className="bg-surface-container-low rounded-xl p-5 sm:p-space-lg shadow-xl mb-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="p-space-xs bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined text-2xl">healing</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Soil Conditions & Nutrient Improvement Protocol
              </h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Prescribed remediation cycle formulated by Bio-Telemetry AI engine
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-space-xs rounded-lg border border-outline-variant/30">
            <span className="font-telemetry-label text-telemetry-label text-on-surface-variant uppercase text-[11px]">
              CYCLE ID:
            </span>
            <span className="font-code-sm text-code-sm text-primary font-bold">
              PRT-TOM-2025-04
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
          {/* Root Cause Analysis Callout */}
          <div className="md:col-span-5 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between border border-outline-variant/20">
            <div className="flex flex-col gap-space-xs">
              <span className="font-telemetry-label text-telemetry-label text-primary uppercase text-[10px]">
                ROOT CAUSE DIAGNOSIS
              </span>
              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">
                Vegetative Acceleration Depletion
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The active crop has crossed day 38 of vegetative canopy expansion. Accelerated stomatal conduction has driven root uptake of accessible nitrates 34% faster than standard microbial mineralization rates in the 5-15cm band.
              </p>
            </div>
            <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant font-code-sm text-code-sm border-t border-outline-variant/20">
              <span>DEPLETION RATE: 2.1 mg/kg/day</span>
              <span className="text-tertiary">SAFE MARGIN: 48h</span>
            </div>
          </div>

          {/* Actionable Step Checklist */}
          <div className="md:col-span-7 bg-surface-container-lowest p-space-md rounded-xl flex flex-col justify-between gap-space-sm border border-outline-variant/20">
            <span className="font-telemetry-label text-telemetry-label text-secondary uppercase text-[10px]">
              AUTOMATED ACTION CHECKLIST
            </span>

            <div className="flex flex-col gap-space-xs">
              {protocolActions.map((action) => (
                <label
                  key={action.id}
                  className="group flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-high/60 hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/15"
                >
                  <input
                    type="checkbox"
                    checked={action.completed}
                    onChange={() => onToggleProtocolAction(action.id)}
                    className="mt-1 w-4 h-4 rounded bg-surface-container-highest accent-primary cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span
                      className={`font-body-md text-body-md font-semibold transition-colors ${
                        action.completed ? 'text-primary line-through/30' : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      {action.title}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {action.detail}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                onClick={onDismissProtocol}
                className="bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm px-space-md py-space-xs rounded-lg transition-all border border-outline-variant/30 cursor-pointer"
              >
                Dismiss Protocol
              </button>
              <button
                onClick={onLogProtocol}
                className={`font-title-sm text-body-sm font-bold px-space-md py-space-xs rounded-lg transition-all flex items-center gap-space-xs cursor-pointer ${
                  protocolLogged
                    ? 'bg-tertiary text-on-tertiary shadow-[0_0_15px_rgba(98,220,173,0.3)]'
                    : 'bg-primary hover:shadow-[0_0_20px_rgba(78,222,163,0.4)] text-on-primary'
                }`}
                id="commit-protocol-btn"
              >
                <span className="material-symbols-outlined text-base">
                  {protocolLogged ? 'verified' : 'task_alt'}
                </span>
                <span>
                  {protocolLogged ? 'Logged in Bio-Ledger' : 'Confirm & Log Application'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Layer Detail Inspector Modal */}
      {activeLayerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveLayerModal(null)}
        >
          <div
            className="bg-surface-container-low border border-primary/30 rounded-xl max-w-lg w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLayerModal(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeLayerModal.color }}
              />
              <h3 className="font-title-sm text-on-surface">
                {activeLayerModal.name}
              </h3>
            </div>
            <p className="font-body-md text-on-surface-variant mb-4">
              {activeLayerModal.description}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant block font-mono">
                  VOLUMETRIC WATER (VWC)
                </span>
                <span className="text-xl font-bold font-mono text-primary">
                  {activeLayerModal.vwc}%
                </span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant block font-mono">
                  CONDUCTIVITY (EC)
                </span>
                <span className="text-xl font-bold font-mono text-secondary">
                  {activeLayerModal.ec} mS/cm
                </span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant block font-mono">
                  LAYER TEMPERATURE
                </span>
                <span className="text-xl font-bold font-mono text-tertiary">
                  {activeLayerModal.tempC}°C
                </span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant block font-mono">
                  ORGANIC MATTER
                </span>
                <span className="text-xl font-bold font-mono text-on-surface">
                  {activeLayerModal.organicMatter}%
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setActiveLayerModal(null)}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-[0_0_15px_rgba(78,222,163,0.3)] transition-all cursor-pointer"
              >
                Close Layer Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
