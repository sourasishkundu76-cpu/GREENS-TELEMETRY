import React, { useState } from 'react';

interface LeafSample {
  id: string;
  name: string;
  category: string;
  confidence: number;
  ndvi: number;
  fvFm: number;
  symptoms: string;
  diagnosis: string;
  remedy: string;
  icon: string;
}

const LEAF_SAMPLES: LeafSample[] = [
  {
    id: 'sample-n',
    name: 'Lower Canopy Chlorosis',
    category: 'Nutrient Deficiency',
    confidence: 96,
    ndvi: 0.61,
    fvFm: 0.74,
    symptoms: 'Uniform interveinal pale yellowing starting from oldest basal foliage upward.',
    diagnosis: 'Nitrogen (N) Mobile Translocation Deficit due to rapid vegetative expansion.',
    remedy: 'Top-dress 15g cold-processed kelp + blood meal or apply 1:20 foliar organic fish amino acid spray before dusk.',
    icon: '🍂',
  },
  {
    id: 'sample-k',
    name: 'Marginal Leaf Tip Scorch',
    category: 'Ionic Imbalance',
    confidence: 89,
    ndvi: 0.68,
    fvFm: 0.76,
    symptoms: 'Curling brown necrosis on margins of mid-canopy leaves with dull leaf sheen.',
    diagnosis: 'Potassium (K) Stress. Restricted stomatal regulation during peak thermal hours.',
    remedy: 'Amend substrate with water-soluble sulfate of potash / langbeinite (2g/L) during upcoming fertigation cycle.',
    icon: '🥀',
  },
  {
    id: 'sample-ca',
    name: 'New Growth Tip Distortion',
    category: 'Transpiration Translocation',
    confidence: 84,
    ndvi: 0.72,
    fvFm: 0.78,
    symptoms: 'Slight cupping of tender shoot tips, heightened blossom end rot vulnerability.',
    diagnosis: 'Calcium (Ca) Immobility caused by stagnant humidity spikes (low VPD).',
    remedy: 'Boost exhaust fan PWM by 15% to drive 1.2 kPa VPD; supplement calcium-magnesium acetate.',
    icon: '🌱',
  },
  {
    id: 'sample-healthy',
    name: 'Vibrant Vegetative Baseline',
    category: 'Homeostasis',
    confidence: 98,
    ndvi: 0.86,
    fvFm: 0.83,
    symptoms: 'Deep forest emerald turgor, robust trichome development, zero lesion artifacts.',
    diagnosis: 'Optimal photosynthetic index. High cellular respiration and microbial vigor.',
    remedy: 'Maintain baseline nutrient recipe. Monitor subsoil moisture buffer.',
    icon: '🌿',
  },
];

export const AIDoctorView: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<LeafSample>(LEAF_SAMPLES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Greetings Dr. Thorne. Bio-Telemetry AI engine is online. Multi-depth sensor arrays and optical spectrometer are synchronized with your tomato canopy. How may I assist your crop protocol today?',
      time: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const handleSelectSample = (sample: LeafSample) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedSample(sample);
      setIsScanning(false);
    }, 600);
  };

  const handleSendQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputQuestion('');

    // Generate intelligent agronomy response
    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();
      if (lower.includes('nitrogen') || lower.includes('kelp')) {
        aiReply = `Regarding Nitrogen recovery: With the applied 15g organic kelp & blood meal top-dress, microbial mineralization in the active rhizosphere (5-15cm) will reach peak nitrate release within 48 to 72 hours. Stomatal uptake will stabilize leaf NDVI to >0.80 by Friday.`;
      } else if (lower.includes('ec') || lower.includes('subsoil') || lower.includes('salt')) {
        aiReply = `The subsoil EC of 2.4 mS/cm is due to downward capillary migration of mineral salts. Ensure your next fertigation achieves a 15-20% runoff fraction to purge heavy sodium and sulfates from the 25cm bedrock zone.`;
      } else if (lower.includes('vpd') || lower.includes('humidity') || lower.includes('temp')) {
        aiReply = `Current canopy VPD sits at 1.15 kPa at 25.4°C and 64% RH. This is in the optimal vegetative zone. For the upcoming flowering phase, targeting 1.3 to 1.5 kPa will stimulate greater calcium transpiration into fruit clusters.`;
      } else {
        aiReply = `Analysis recorded. Substrate sensors show 82% VWC with 6.4 pH. The root core temperature of 24.8°C promotes robust bacterial colonization. I recommend keeping current irrigation timings while monitoring Probe #01 for nitrate rebound.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: now }]);
    }, 800);
  };

  const promptSuggestions = [
    'How quickly will nitrogen bounce back after top dressing?',
    'Why is subsoil EC rising to 2.4 mS/cm?',
    'What is the ideal rhizosphere temperature for tomato fruit-set?',
  ];

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm pt-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
          <span className="text-primary font-bold">AI_DOCTOR</span>
          <span>//</span>
          <span>PATHOLOGY_SPECTROMETER</span>
          <span>//</span>
          <span className="text-tertiary">MODEL_V3.8_AGRO_BIO</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-telemetry-label text-primary uppercase text-[11px]">
            AI DIAGNOSTIC INFERENCE ENGINE READY
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 sm:p-space-lg mb-space-lg shadow-xl border border-outline-variant/20 mt-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="font-telemetry-label uppercase tracking-widest text-primary text-[11px]">
              BIO-MOLECULAR PATHOLOGY & AI AGRONOMY CONSULT
            </span>
            <h1 className="font-headline-xl text-on-surface tracking-tight mt-1">
              AI DOCTOR & SPECTROMETER 🩺
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Real-time leaf spectroscopy, chlorophyll fluorescence indices, pathogen detection, and conversational agronomic consultations.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30">
            <span className="text-3xl">🔬</span>
            <div className="flex flex-col">
              <span className="font-code-sm text-xs text-primary font-bold">NDVI SPEC-01</span>
              <span className="text-xs text-on-surface-variant">Calibrated Wavelengths: 400nm - 850nm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Spectrometer Pathology Lab & Agronomist Chat */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left 7 cols: Spectrometer & Symptom Inspector */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-space-md">
          {/* Sample Selector */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-on-surface text-sm font-semibold">
                Select Leaf Sample / Scan Specimen:
              </span>
              <span className="font-code-sm text-xs text-primary">
                {LEAF_SAMPLES.length} SAMPLES LOADED
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEAF_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3 rounded-lg flex flex-col items-center text-center gap-1 border transition-all cursor-pointer ${
                    selectedSample.id === sample.id
                      ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-md'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="text-2xl">{sample.icon}</span>
                  <span className="font-title-sm text-xs leading-tight">{sample.name}</span>
                  <span className="text-[10px] text-outline font-code-sm uppercase">{sample.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Spectroscopy Card */}
          <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">biotech</span>
                <h3 className="font-title-sm text-on-surface">
                  Spectrographic Absorption Analysis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-code-sm text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/30">
                  {isScanning ? 'CALIBRATING...' : `${selectedSample.confidence}% CONFIDENCE`}
                </span>
              </div>
            </div>

            {/* Visual SVG Spectrogram */}
            <div className="relative bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 overflow-hidden">
              <div className="flex justify-between items-center text-xs font-code-sm text-on-surface-variant mb-2">
                <span>SPECTRAL ABSORBANCE (nm)</span>
                <span className="text-primary">Chlorophyll a/b Ratio: 3.1:1</span>
              </div>

              {/* SVG Wave Chart */}
              <div className="h-44 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="specGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#4edea3" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4edea3" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#182e25" strokeDasharray="4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#182e25" strokeDasharray="4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#182e25" strokeDasharray="4" />

                  {/* Dynamic waveform based on sample */}
                  <path
                    d={
                      selectedSample.id === 'sample-n'
                        ? 'M 0,140 Q 70,30 140,90 T 280,120 T 400,45 T 500,110 L 500,160 L 0,160 Z'
                        : selectedSample.id === 'sample-k'
                        ? 'M 0,130 Q 90,60 170,110 T 310,80 T 420,35 T 500,100 L 500,160 L 0,160 Z'
                        : selectedSample.id === 'sample-ca'
                        ? 'M 0,120 Q 80,45 150,95 T 300,70 T 410,40 T 500,85 L 500,160 L 0,160 Z'
                        : 'M 0,110 Q 75,25 150,75 T 290,50 T 400,25 T 500,70 L 500,160 L 0,160 Z'
                    }
                    fill="url(#areaGrad)"
                  />
                  <path
                    d={
                      selectedSample.id === 'sample-n'
                        ? 'M 0,140 Q 70,30 140,90 T 280,120 T 400,45 T 500,110'
                        : selectedSample.id === 'sample-k'
                        ? 'M 0,130 Q 90,60 170,110 T 310,80 T 420,35 T 500,100'
                        : selectedSample.id === 'sample-ca'
                        ? 'M 0,120 Q 80,45 150,95 T 300,70 T 410,40 T 500,85'
                        : 'M 0,110 Q 75,25 150,75 T 290,50 T 400,25 T 500,70'
                    }
                    fill="none"
                    stroke="url(#specGrad)"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] font-code-sm text-outline mt-2 pt-1 border-t border-outline-variant/30">
                <span>400nm (Blue)</span>
                <span>550nm (Green)</span>
                <span>680nm (Chlorophyll a)</span>
                <span>730nm (Far-Red)</span>
                <span>850nm (NIR)</span>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="font-telemetry-label text-on-surface-variant text-[10px] block">
                  CANOPY NDVI SCORE
                </span>
                <span className="font-telemetry-metric text-2xl font-bold text-primary">
                  {selectedSample.ndvi}
                </span>
                <span className="text-[11px] text-on-surface-variant block font-code-sm">
                  {selectedSample.ndvi > 0.8 ? 'Max Vigor' : 'Mild Depletion Detected'}
                </span>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="font-telemetry-label text-on-surface-variant text-[10px] block">
                  Fv / Fm FLUORESCENCE
                </span>
                <span className="font-telemetry-metric text-2xl font-bold text-secondary">
                  {selectedSample.fvFm}
                </span>
                <span className="text-[11px] text-on-surface-variant block font-code-sm">
                  Photosystem II Photochemical Yield
                </span>
              </div>
            </div>

            {/* Clinical Remediation Output */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-primary/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-title-sm text-sm font-semibold">
                <span className="material-symbols-outlined text-lg">medical_information</span>
                <span>Diagnosis: {selectedSample.diagnosis}</span>
              </div>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Symptoms:</strong> {selectedSample.symptoms}
              </p>
              <div className="p-3 bg-primary-container/15 rounded-lg border border-primary/30 text-xs font-body-md text-on-surface leading-relaxed">
                <strong className="text-primary font-code-sm block mb-1 uppercase">
                  Prescribed Organic Treatment:
                </strong>
                {selectedSample.remedy}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: AI Agronomist Interactive Consult */}
        <div className="col-span-12 xl:col-span-5 flex flex-col h-[700px] bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">psychology</span>
              <div className="flex flex-col">
                <h3 className="font-title-sm text-on-surface text-sm font-semibold">
                  AI Agronomist Consultation
                </h3>
                <span className="font-code-sm text-[11px] text-secondary">
                  Connected to ESP32 Biosphere Model
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-col gap-1.5 py-3 border-b border-outline-variant/20">
            <span className="text-[11px] font-telemetry-label text-on-surface-variant uppercase">
              SUGGESTED CLINICAL INQUIRIES:
            </span>
            <div className="flex flex-col gap-1">
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputQuestion(prompt);
                  }}
                  className="text-left text-xs text-on-surface-variant hover:text-primary bg-surface-container-lowest p-2 rounded border border-outline-variant/25 transition-colors cursor-pointer truncate"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3 pr-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-on-primary font-medium'
                      : 'bg-surface-container-lowest text-on-surface border border-outline-variant/30 font-body-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-outline font-code-sm mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendQuestion} className="pt-3 border-t border-outline-variant/20 flex gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask Agronomist AI about soil, nutrients, pests..."
              className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs sm:text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary font-body-md"
            />
            <button
              type="submit"
              className="bg-primary hover:shadow-[0_0_12px_rgba(78,222,163,0.35)] text-on-primary px-3 py-2 rounded-lg text-xs font-bold font-code-sm flex items-center justify-center cursor-pointer transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
