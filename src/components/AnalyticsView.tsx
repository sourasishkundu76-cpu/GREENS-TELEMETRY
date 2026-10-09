import React, { useState } from 'react';

export const AnalyticsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Simulated 24-point dataset for 24h
  const data24h = [
    { hour: '00:00', surface: 66, rhizo: 80, subsoil: 91, n: 62 },
    { hour: '02:00', surface: 65, rhizo: 79, subsoil: 91, n: 62 },
    { hour: '04:00', surface: 64, rhizo: 79, subsoil: 91, n: 61 },
    { hour: '06:00', surface: 63, rhizo: 78, subsoil: 91, n: 61 },
    { hour: '08:00', surface: 75, rhizo: 84, subsoil: 92, n: 60 }, // Irrigation pulse
    { hour: '10:00', surface: 72, rhizo: 83, subsoil: 92, n: 59 },
    { hour: '12:00', surface: 70, rhizo: 82, subsoil: 91, n: 59 },
    { hour: '14:00', surface: 68, rhizo: 81, subsoil: 91, n: 58 },
    { hour: '16:00', surface: 66, rhizo: 80, subsoil: 91, n: 58 },
    { hour: '18:00', surface: 78, rhizo: 85, subsoil: 92, n: 58 }, // Dusk pulse
    { hour: '20:00', surface: 72, rhizo: 83, subsoil: 92, n: 58 },
    { hour: '22:00', surface: 69, rhizo: 82, subsoil: 91, n: 58 },
  ];

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm pt-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
          <span className="text-primary font-bold">ANALYTICS_MODULE</span>
          <span>//</span>
          <span>MULTI_DEPTH_HISTORICAL</span>
          <span>//</span>
          <span className="text-secondary">SPECTRO_SERIES</span>
        </div>
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30">
          {(['24h', '7d', '30d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded text-xs font-code-sm transition-colors cursor-pointer ${
                timeframe === t
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 sm:p-space-lg mb-space-lg shadow-xl border border-outline-variant/20 mt-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="font-telemetry-label uppercase tracking-widest text-primary text-[11px]">
              SUBSTRATE HYDROLOGY & MINERAL KINETICS
            </span>
            <h1 className="font-headline-xl text-on-surface tracking-tight mt-1">
              BIO-TELEMETRY ANALYTICS 📈
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Long-term diurnal dry-back signatures, root respiration peaks, and precision nutrient depletion projections.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-telemetry-label text-on-surface-variant uppercase text-[10px]">
                DAILY DRY-BACK
              </span>
              <span className="font-telemetry-metric text-primary text-2xl font-bold">
                8.4%
              </span>
            </div>
            <div className="w-px h-10 bg-outline-variant/40" />
            <div className="flex flex-col">
              <span className="font-telemetry-label text-on-surface-variant uppercase text-[10px]">
                MINERAL TURNOVER
              </span>
              <span className="font-telemetry-metric text-secondary text-2xl font-bold">
                1.4x
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Chart Card: Multi-Depth Volumetric Water Content */}
      <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl mb-space-lg flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">show_chart</span>
            <h3 className="font-title-sm text-on-surface">
              Multi-Depth Substrate VWC% Dry-Back Curves
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-code-sm">
            <span className="flex items-center gap-1.5 text-tertiary">
              <span className="w-2.5 h-1 bg-tertiary rounded" /> Probe #02 Surface (3cm)
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-1 bg-primary rounded" /> Probe #01 Rhizosphere (12cm)
            </span>
            <span className="flex items-center gap-1.5 text-outline">
              <span className="w-2.5 h-1 bg-outline rounded" /> Probe #03 Subsoil (25cm)
            </span>
          </div>
        </div>

        {/* Interactive SVG Line Graph */}
        <div className="h-64 w-full relative bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between">
          <div className="absolute top-2 left-4 text-[10px] font-code-sm text-on-surface-variant">
            VWC % (VOLUMETRIC MOISTURE)
          </div>

          <svg className="w-full h-full pt-4 pb-2" viewBox="0 0 600 180" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="600" y2="30" stroke="#182e25" strokeDasharray="3" />
            <line x1="0" y1="75" x2="600" y2="75" stroke="#182e25" strokeDasharray="3" />
            <line x1="0" y1="120" x2="600" y2="120" stroke="#182e25" strokeDasharray="3" />
            <line x1="0" y1="165" x2="600" y2="165" stroke="#182e25" strokeDasharray="3" />

            {/* Target band (70% - 85%) */}
            <rect x="0" y="45" width="600" height="45" fill="#4edea3" fillOpacity="0.06" />

            {/* Subsoil (25cm) Curve - Grey */}
            <path
              d="M 0,40 L 50,40 L 100,41 L 150,41 L 200,38 L 250,38 L 300,40 L 350,40 L 400,40 L 450,38 L 500,38 L 600,40"
              fill="none"
              stroke="#86948a"
              strokeWidth="2"
            />

            {/* Rhizosphere (12cm) Curve - Emerald */}
            <path
              d="M 0,70 L 50,72 L 100,75 L 150,76 L 200,55 L 250,60 L 300,65 L 350,70 L 400,74 L 450,52 L 500,62 L 600,68"
              fill="none"
              stroke="#4edea3"
              strokeWidth="2.5"
            />

            {/* Surface (3cm) Curve - Cyan */}
            <path
              d="M 0,100 L 50,105 L 100,108 L 150,112 L 200,70 L 250,82 L 300,90 L 350,96 L 400,104 L 450,64 L 500,80 L 600,95"
              fill="none"
              stroke="#62dcad"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>

          {/* Time Labels */}
          <div className="flex justify-between text-[11px] font-code-sm text-outline pt-1 border-t border-outline-variant/30">
            {data24h.map((d, i) => (
              <span key={i} className="hidden sm:inline">
                {d.hour}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: NPK Depletion vs Microbial Mineralization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="font-title-sm text-sm text-on-surface font-semibold">
              Nitrogen Mineralization vs Vegetative Uptake
            </h4>
            <span className="font-code-sm text-xs text-error font-bold">DEFICIT WARNING</span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-xs">
            Soil bio-sensors recorded root uptake exceeding background microbial nitrogen mineralization by 34% over the last 48 hours.
          </p>
          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex justify-between items-center font-code-sm text-xs">
            <span>Uptake Rate: 2.1 mg/kg/day</span>
            <span className="text-primary font-bold">Post-Kelp Target: +2.8 mg/kg/day</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="font-title-sm text-sm text-on-surface font-semibold">
              Root Transpiration Efficiency
            </h4>
            <span className="font-code-sm text-xs text-primary font-bold">NOMINAL</span>
          </div>
          <p className="font-body-sm text-on-surface-variant text-xs">
            Calculated hydraulic conductivity of 1.24 cm/hr indicates excellent substrate pore porosity with no root compaction zones.
          </p>
          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex justify-between items-center font-code-sm text-xs">
            <span>Vascular Flow: 14.6 mL/hr</span>
            <span className="text-secondary font-bold">Stomatal Resistance: 42 s/m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
