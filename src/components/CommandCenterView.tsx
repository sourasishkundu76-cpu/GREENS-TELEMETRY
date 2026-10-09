import React, { useState } from 'react';

export const CommandCenterView: React.FC = () => {
  const [relays, setRelays] = useState([
    { id: 'relay-fan', name: 'Canopy Exhaust Fan', status: true, mode: 'PWM 45%', powerWatts: 64 },
    { id: 'relay-pump', name: 'Substrate Drip Solenoid', status: false, mode: 'Pulse (18:00)', powerWatts: 0 },
    { id: 'relay-humid', name: 'Ultrasonic Humidifier', status: true, mode: 'Duty 60%', powerWatts: 38 },
    { id: 'relay-light', name: 'Samsung LM301H LED Array', status: true, mode: 'Full Spectrum (780 PPFD)', powerWatts: 320 },
  ]);

  const [canopyViewMode, setCanopyViewMode] = useState<'rgb' | 'thermal' | 'ndvi'>('rgb');

  const toggleRelay = (id: string) => {
    setRelays(prev =>
      prev.map(r => (r.id === id ? { ...r, status: !r.status, powerWatts: !r.status ? 45 : 0 } : r))
    );
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm pt-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
          <span className="text-primary font-bold">COMMAND_CENTER</span>
          <span>//</span>
          <span>CANOPY_CHAMBER_01</span>
          <span>//</span>
          <span className="text-tertiary">CLOSED_LOOP_ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-telemetry-label text-primary uppercase text-[11px]">
            AUTONOMOUS BIOSPHERE REGULATION ON
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 sm:p-space-lg mb-space-lg shadow-xl border border-outline-variant/20 mt-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="font-telemetry-label uppercase tracking-widest text-secondary text-[11px]">
              MASTER GREENHOUSE TELEMETRY // ZONE A
            </span>
            <h1 className="font-headline-xl text-on-surface tracking-tight mt-1">
              COMMAND CENTER 🛸
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Supervising aerial micro-climates, transpiration drivers, and closed-loop relay actuations in concert with substrate dynamics.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-telemetry-label text-on-surface-variant uppercase text-[10px]">
                TOTAL POWER DRAW
              </span>
              <span className="font-telemetry-metric text-primary text-2xl font-bold">
                {relays.reduce((acc, r) => acc + (r.status ? r.powerWatts : 0), 0)} W
              </span>
            </div>
            <div className="w-px h-10 bg-outline-variant/40" />
            <div className="flex flex-col">
              <span className="font-telemetry-label text-on-surface-variant uppercase text-[10px]">
                ACTIVE ACTUATORS
              </span>
              <span className="font-telemetry-metric text-secondary text-2xl font-bold">
                {relays.filter(r => r.status).length} / 4
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Micro-climate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-lg">
        {/* VPD Card */}
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-telemetry-label uppercase text-on-surface-variant text-[10px]">
              VAPOR PRESSURE DEFICIT (VPD)
            </span>
            <span className="material-symbols-outlined text-primary text-lg">air</span>
          </div>
          <div className="my-3">
            <span className="font-telemetry-metric text-3xl font-bold text-primary">
              1.15
            </span>
            <span className="font-code-sm text-sm text-on-surface-variant ml-1.5">
              kPa
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-code-sm text-primary">
            <span>Optimal Stomatal Window</span>
            <span className="text-on-surface-variant">Target 1.0-1.3</span>
          </div>
        </div>

        {/* PAR Light Intensity */}
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-telemetry-label uppercase text-on-surface-variant text-[10px]">
              LIGHT SPECTRUM (PAR)
            </span>
            <span className="material-symbols-outlined text-secondary text-lg">wb_sunny</span>
          </div>
          <div className="my-3">
            <span className="font-telemetry-metric text-3xl font-bold text-secondary">
              780
            </span>
            <span className="font-code-sm text-sm text-on-surface-variant ml-1.5">
              µmol/m²/s
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-code-sm text-secondary">
            <span>Daily Light Integral: 38 DLI</span>
            <span className="text-on-surface-variant">18h photoperiod</span>
          </div>
        </div>

        {/* Ambient CO2 */}
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-telemetry-label uppercase text-on-surface-variant text-[10px]">
              ENRICHED CO2 LEVEL
            </span>
            <span className="material-symbols-outlined text-tertiary text-lg">co2</span>
          </div>
          <div className="my-3">
            <span className="font-telemetry-metric text-3xl font-bold text-tertiary">
              820
            </span>
            <span className="font-code-sm text-sm text-on-surface-variant ml-1.5">
              ppm
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-code-sm text-tertiary">
            <span>+110% Photosynthetic Rate</span>
            <span className="text-on-surface-variant">Solenoid 20 PSI</span>
          </div>
        </div>

        {/* Temperature & Humidity */}
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-telemetry-label uppercase text-on-surface-variant text-[10px]">
              CANOPY TEMP / RH
            </span>
            <span className="material-symbols-outlined text-primary text-lg">thermostat</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-telemetry-metric text-2xl font-bold text-on-surface">
              25.4°C
            </span>
            <span className="text-outline">/</span>
            <span className="font-telemetry-metric text-2xl font-bold text-secondary">
              64% RH
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-code-sm text-on-surface-variant">
            <span>Dew Point: 18.1°C</span>
            <span className="text-primary font-semibold">Nominal</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Canopy Twin & Relay Actuation Rack */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left 7 cols: Canopy Twin Feed */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-space-md bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">videocam</span>
              <h3 className="font-title-sm text-on-surface">
                Autonomous Optical Twin // Canopy Camera
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30">
              <button
                onClick={() => setCanopyViewMode('rgb')}
                className={`px-2.5 py-1 text-xs rounded font-code-sm transition-colors cursor-pointer ${
                  canopyViewMode === 'rgb'
                    ? 'bg-primary text-on-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                RGB FEED
              </button>
              <button
                onClick={() => setCanopyViewMode('thermal')}
                className={`px-2.5 py-1 text-xs rounded font-code-sm transition-colors cursor-pointer ${
                  canopyViewMode === 'thermal'
                    ? 'bg-secondary text-on-secondary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                THERMAL FLIR
              </button>
              <button
                onClick={() => setCanopyViewMode('ndvi')}
                className={`px-2.5 py-1 text-xs rounded font-code-sm transition-colors cursor-pointer ${
                  canopyViewMode === 'ndvi'
                    ? 'bg-tertiary text-on-tertiary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                NDVI HEALTH
              </button>
            </div>
          </div>

          {/* Interactive Simulation Display */}
          <div className="relative h-[340px] rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center">
            <div
              className={`absolute inset-0 transition-all duration-700 ${
                canopyViewMode === 'thermal'
                  ? 'bg-gradient-to-tr from-purple-950 via-rose-900 to-amber-700 opacity-80'
                  : canopyViewMode === 'ndvi'
                  ? 'bg-gradient-to-br from-emerald-950 via-emerald-800 to-lime-600 opacity-85'
                  : 'bg-gradient-to-b from-surface-container-lowest via-surface-container-low to-surface-container-high'
              }`}
            />
            {/* Overlay grid lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #4edea3 1px, transparent 1px), linear-gradient(to bottom, #4edea3 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative z-10 text-center flex flex-col items-center p-6">
              <span className="text-6xl mb-3">🌿</span>
              <span className="font-title-sm text-primary font-bold">
                {canopyViewMode === 'rgb'
                  ? 'High-Resolution 4K Horticultural Stream'
                  : canopyViewMode === 'thermal'
                  ? 'FLIR Infrared Leaf Transpiration Map (23.2°C – 25.1°C)'
                  : 'Multi-spectral NDVI Leaf Vigor Score: 0.84 (Exceptional)'}
              </span>
              <p className="font-body-sm text-on-surface-variant max-w-md mt-1">
                Zero signs of powdery mildew, leaf septoria, or spider mites. Stomatal aperture is wide open and actively drawing transpiration pull from Probe #01.
              </p>
            </div>

            {/* Corner tags */}
            <span className="absolute bottom-3 left-3 font-code-sm text-xs text-primary/80 bg-surface-container-lowest/80 px-2 py-1 rounded">
              FPS: 30 // STREAM: H.265 RTSP
            </span>
            <span className="absolute bottom-3 right-3 font-code-sm text-xs text-secondary/80 bg-surface-container-lowest/80 px-2 py-1 rounded">
              EXPOSURE: -0.5 EV AUTO
            </span>
          </div>
        </div>

        {/* Right 5 cols: Hardware Relay Rack */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-space-md bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">toggle_on</span>
              <h3 className="font-title-sm text-on-surface">Hardware Actuator Relays</h3>
            </div>
            <span className="font-code-sm text-xs text-on-surface-variant">
              SSR_BUS: RELAY_4CH_I2C
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {relays.map((relay) => (
              <div
                key={relay.id}
                className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/30 flex items-center justify-between hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-title-sm text-sm text-on-surface font-semibold">
                    {relay.name}
                  </span>
                  <span className="font-code-sm text-xs text-on-surface-variant">
                    {relay.mode} • {relay.status ? `${relay.powerWatts}W` : '0W standby'}
                  </span>
                </div>
                <button
                  onClick={() => toggleRelay(relay.id)}
                  className={`px-3 py-1.5 rounded-lg font-code-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    relay.status
                      ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(78,222,163,0.3)]'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      relay.status ? 'bg-on-primary animate-pulse' : 'bg-outline'
                    }`}
                  />
                  <span>{relay.status ? 'ACTIVE' : 'OFFLINE'}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-tertiary">schedule</span>
              <span>Next automated fertigation pulse in 4h 12m</span>
            </div>
            <span className="font-code-sm text-xs text-primary font-bold">18:00 DUSK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
