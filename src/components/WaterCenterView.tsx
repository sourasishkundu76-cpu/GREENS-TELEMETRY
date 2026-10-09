import React, { useState } from 'react';

export const WaterCenterView: React.FC = () => {
  const [reservoirLiters, setReservoirLiters] = useState(780);
  const [dosingStatus, setDosingStatus] = useState<string | null>(null);

  const [pumps, setPumps] = useState([
    { id: 'pump-npk', name: 'Pump 01: Macro N-P-K Solution', formula: 'Bio-Grow 3-1-4', flowRate: '1.2 mL/s', calibrated: true },
    { id: 'pump-micro', name: 'Pump 02: Chelate Micro & Iron', formula: 'Fe-EDDHA + Boron', flowRate: '0.8 mL/s', calibrated: true },
    { id: 'pump-ph', name: 'Pump 03: pH Down Stabilizer', formula: '10% Phosphoric Acid', flowRate: '0.4 mL/s', calibrated: true },
    { id: 'pump-bio', name: 'Pump 04: Rhizosphere Inoculant', formula: 'Bacillus subtilis bio-consortium', flowRate: '1.0 mL/s', calibrated: true },
  ]);

  const handleManualDose = (pumpName: string) => {
    setDosingStatus(`Dosing 5mL via ${pumpName}...`);
    setTimeout(() => {
      setDosingStatus(`5mL injected successfully. Sensor EC equilibrating.`);
      setTimeout(() => setDosingStatus(null), 3000);
    }, 1500);
  };

  const handleRefillReservoir = () => {
    setReservoirLiters(950);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm pt-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
          <span className="text-secondary font-bold">WATER_CENTER</span>
          <span>//</span>
          <span>RESERVOIR_BAY_01</span>
          <span>//</span>
          <span className="text-primary">DOSING_MANIFOLD_ONLINE</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-telemetry-label text-secondary uppercase text-[11px]">
            PRESSURE: 38.4 PSI REGULATED
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 sm:p-space-lg mb-space-lg shadow-xl border border-outline-variant/20 mt-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="font-telemetry-label uppercase tracking-widest text-secondary text-[11px]">
              PRECISION HYDROPONIC & SUBSTRATE IRRIGATION
            </span>
            <h1 className="font-headline-xl text-on-surface tracking-tight mt-1">
              WATER & DOSING CENTER 💧
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Main reservoir telemetry, automated ionic electro-conductivity balancing, dissolved oxygen retention, and multi-channel peristaltic dosing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefillReservoir}
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/40 px-4 py-2 rounded-lg font-code-sm text-xs font-bold transition-all cursor-pointer"
            >
              Simulate Tank Top-Up (+RO)
            </button>
          </div>
        </div>
      </section>

      {/* Feedback Toast */}
      {dosingStatus && (
        <div className="mb-4 p-3 bg-secondary-container/20 border border-secondary/60 text-secondary rounded-lg text-sm font-mono flex items-center gap-2">
          <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
          <span>{dosingStatus}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left 6 cols: Reservoir Status & Water Quality */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-space-md">
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-xl">water_bottle</span>
                <h3 className="font-title-sm text-on-surface">Main Tank Capacity & Hydro-Metrics</h3>
              </div>
              <span className="font-code-sm text-xs text-secondary font-bold">78% FULL</span>
            </div>

            {/* Tank Level Progress Bar */}
            <div className="flex flex-col gap-2 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
              <div className="flex justify-between items-baseline">
                <span className="font-telemetry-label text-on-surface-variant uppercase text-xs">
                  CURRENT WATER VOLUME
                </span>
                <span className="font-telemetry-metric text-2xl font-bold text-secondary">
                  {reservoirLiters} / 1000 L
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-700"
                  style={{ width: `${(reservoirLiters / 1000) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-code-sm text-on-surface-variant">
                <span>Low Alert: &lt;200L</span>
                <span>Depletion: ~45L/day</span>
                <span className="text-secondary">Autofill: Enabled</span>
              </div>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="font-telemetry-label text-on-surface-variant text-[10px] block">
                  WATER TEMPERATURE
                </span>
                <span className="font-telemetry-metric text-xl font-bold text-secondary">
                  19.8°C
                </span>
                <span className="text-[11px] text-tertiary block font-code-sm">
                  Chiller Active (Target 19-21°C)
                </span>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="font-telemetry-label text-on-surface-variant text-[10px] block">
                  DISSOLVED OXYGEN (DO)
                </span>
                <span className="font-telemetry-metric text-xl font-bold text-primary">
                  7.9 mg/L
                </span>
                <span className="text-[11px] text-primary block font-code-sm">
                  Root Hypoxia Guard Safe
                </span>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="font-telemetry-label text-on-surface-variant text-[10px] block">
                  ELECTRO-CONDUCTIVITY (EC)
                </span>
                <span className="font-telemetry-metric text-xl font-bold text-secondary">
                  1.62 mS/cm
                </span>
                <span className="text-[11px] text-on-surface-variant block font-code-sm">
                  TDS: ~810 ppm (500 scale)
                </span>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="font-telemetry-label text-on-surface-variant text-[10px] block">
                  NUTRIENT SOLUTION pH
                </span>
                <span className="font-telemetry-metric text-xl font-bold text-primary">
                  6.22 pH
                </span>
                <span className="text-[11px] text-primary block font-code-sm">
                  Optimal Mineral Uptake
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 cols: Peristaltic Dosing Manifold */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-space-md">
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">precision_manufacturing</span>
                <h3 className="font-title-sm text-on-surface">Peristaltic Dosing Injector Manifold</h3>
              </div>
              <span className="font-code-sm text-xs text-on-surface-variant">STEPPER MOTORS: 4/4 READY</span>
            </div>

            <div className="flex flex-col gap-3">
              {pumps.map((pump) => (
                <div
                  key={pump.id}
                  className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/30 flex items-center justify-between hover:border-secondary/40 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-title-sm text-sm text-on-surface font-semibold">
                      {pump.name}
                    </span>
                    <span className="font-code-sm text-xs text-secondary font-medium">
                      {pump.formula}
                    </span>
                    <span className="font-code-sm text-[11px] text-on-surface-variant">
                      Flow: {pump.flowRate} • Stepper Micro-stepping: 1/16
                    </span>
                  </div>
                  <button
                    onClick={() => handleManualDose(pump.name)}
                    className="bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-secondary border border-secondary/30 px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all cursor-pointer"
                  >
                    Pulse 5mL
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-primary">eco</span>
                <span>Current Substrate Runoff Ratio: 18.2% (Target: 15-20%)</span>
              </div>
              <span className="font-code-sm text-primary font-bold">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
