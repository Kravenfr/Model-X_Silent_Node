import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Activity,
  FileText,
  MapPin,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  Download,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Video,
  Award,
  Sparkles
} from 'lucide-react';

import forecastData from './data/forecast_data.json';
import { ChoroplethMap } from './components/ChoroplethMap';
import { FanChart, ForecastPoint } from './components/FanChart';
import { AllocationTable, AllocationRow } from './components/AllocationTable';
import { HowToReadModal } from './components/HowToReadModal';
import { DocumentationView } from './components/DocumentationView';

export default function App() {
  const [selectedHorizon, setSelectedHorizon] = useState<number>(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Colombo');
  const [activeScenarioKey, setActiveScenarioKey] = useState<string>('latest_2024');
  const [showHowToRead, setShowHowToRead] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<'forecaster' | 'summary' | 'tech_report' | 'video_script' | 'gh_pages'>('forecaster');

  // Load current active scenario
  const currentScenario = useMemo(() => {
    return (forecastData.scenarios as any)[activeScenarioKey] || (forecastData.scenarios as any)['latest_2024'];
  }, [activeScenarioKey]);

  const metadata = currentScenario.metadata;
  const forecastsList = currentScenario.forecasts as ForecastPoint[];
  const allocationList = currentScenario.allocation as AllocationRow[];

  // District tiers dictionary for selected horizon
  const districtTiers = useMemo(() => {
    const map: Record<string, { tier: string; cases: number; incidence: number; exceedProb: number; isAnomaly?: boolean }> = {};
    forecastsList
      .filter((f) => f.horizon === selectedHorizon)
      .forEach((f) => {
        map[(f as any).district_name] = {
          tier: f.risk_tier,
          cases: f.pred_median,
          incidence: f.incidence_per_100k,
          exceedProb: f.exceed_prob,
          isAnomaly: f.early_anomaly,
        };
      });
    return map;
  }, [forecastsList, selectedHorizon]);

  // Selected district 4-week forecast trajectory
  const selectedDistrictForecasts = useMemo(() => {
    return forecastsList
      .filter((f: any) => f.district_name === selectedDistrict)
      .sort((a, b) => a.horizon - b.horizon);
  }, [forecastsList, selectedDistrict]);

  // Selected district recent historical cases
  const selectedDistrictHistory = useMemo(() => {
    const raw = (forecastData.history_by_district as any)[selectedDistrict] || [];
    return raw.slice(-6).map((r: any) => ({
      week: r.week,
      cases: r.cases,
    }));
  }, [selectedDistrict]);

  // Handle CSV export of the Allocation Matrix
  const handleExportCSV = () => {
    const headers = [
      'allocation_rank',
      'district_name',
      'province',
      'population',
      'max_tier',
      'max_incidence',
      'max_exceed_prob',
      'priority_score',
      'h1_cases',
      'h2_cases',
      'h3_cases',
      'h4_cases',
      'early_anomaly_flag',
      'insufficient_data',
    ];
    const csvRows = [
      headers.join(','),
      ...allocationList.map((r) =>
        [
          r.allocation_rank,
          `"${r.district_name}"`,
          `"${r.province}"`,
          r.population,
          `"${r.max_tier}"`,
          r.max_incidence,
          r.max_exceed_prob,
          r.priority_score,
          r.h1_cases,
          r.h2_cases,
          r.h3_cases,
          r.h4_cases,
          r.early_anomaly_flag,
          r.insufficient_data,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `akarsh_allocation_matrix_${metadata.as_of_origin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tier summary metrics for active horizon
  const horizonTierCounts = useMemo(() => {
    const counts = { Extreme: 0, High: 0, Moderate: 0, Low: 0, 'Insufficient Data': 0 };
    Object.values(districtTiers).forEach((d) => {
      if ((counts as any)[d.tier] !== undefined) {
        (counts as any)[d.tier]++;
      }
    });
    return counts;
  }, [districtTiers]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Competition Banner & Non-Clinical Disclaimer */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/40 px-4 py-1.5 text-center text-xs text-emerald-300 flex flex-wrap items-center justify-center gap-2">
        <span className="flex items-center gap-1 font-bold text-white bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] border border-emerald-700/60">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>ModelX 2.0 (Phase 2: Implementation)</span>
        </span>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <span>
          Team <strong>Silent Node</strong> (IEEE CIS Student Chapter, IIT)
        </span>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <span className="text-slate-300">
          <strong>Notice</strong>: Administrative planning decision-support framework for vector-control teams, <strong>NOT a clinical diagnostic tool</strong>.
        </span>
      </div>

      {/* 2. Top Header with Akarsh Branding and Navigation */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand & System Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-600 shadow-xl shadow-emerald-500/20 text-white flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>AKARSH</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-mono font-bold">
                  v1.0.0
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  26 Health Units
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-semibold hidden md:inline">
                  GitHub Pages Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                4-Week District Dengue Risk Forecaster & Vector-Control Decision Support System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveNavTab('forecaster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'forecaster'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Forecaster</span>
            </button>

            <button
              onClick={() => setActiveNavTab('summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'summary'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2-Page Summary</span>
            </button>

            <button
              onClick={() => setActiveNavTab('tech_report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'tech_report'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tech Report</span>
            </button>

            <button
              onClick={() => setActiveNavTab('video_script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'video_script'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>3-Min Video Script</span>
            </button>

            <button
              onClick={() => setActiveNavTab('gh_pages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'gh_pages'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>GH Pages Link</span>
            </button>

            <button
              onClick={() => setShowHowToRead(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-all ml-1"
              title="How to Read This"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Origin / Simulation Scenario Switcher Strip */}
        <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold uppercase text-[10.5px] tracking-wider flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>Simulation Scenario:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {Object.entries(forecastData.scenarios).map(([key, sc]: [string, any]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveScenarioKey(key);
                      if (activeNavTab !== 'forecaster') setActiveNavTab('forecaster');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeScenarioKey === key
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {key === 'latest_2024'
                      ? 'Live Operational (2024-W20)'
                      : key === 'replay_2017_outbreak'
                      ? 'May 1, 2017 Pre-Peak Replay (--as-of)'
                      : 'Data Interruption Fail-Safe Test'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>Cutoff: <strong className="text-emerald-400 font-bold">{metadata.data_cutoff_week}</strong></span>
              <span>Origin: <strong className="text-white font-bold">{metadata.as_of_origin}</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Prominent Staleness Banner when Flagged */}
      {metadata.staleness_flag && (
        <div className="bg-rose-950/90 border-b border-rose-800 px-4 py-3 animate-pulse">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-rose-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <strong className="text-white font-bold block text-sm">
                DATA STALENESS & SURVEILLANCE INTERRUPTION DETECTED
              </strong>
              <span>
                One or more reporting inputs (e.g., Kalmunai health zone) were missing or delayed beyond threshold.
                Predictive variance has been expanded by 1.5x. Missing districts produce{' '}
                <strong>'Insufficient Data'</strong> and <strong>never default to Low Risk</strong>.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeNavTab !== 'forecaster' ? (
          <DocumentationView onBackToDashboard={() => setActiveNavTab('forecaster')} />
        ) : (
          <>
            {/* Horizon Selector and Summary Metric Cards */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Horizon Tabs (1 to 4 weeks forward) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Horizon:</span>
                </span>
                {[1, 2, 3, 4].map((h) => {
                  const targetSample = forecastsList.find((f) => f.horizon === h);
                  const isSelected = selectedHorizon === h;
                  return (
                    <button
                      key={h}
                      onClick={() => setSelectedHorizon(h)}
                      className={`flex flex-col items-center px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-sky-600 to-sky-700 border-sky-400 text-white shadow-lg shadow-sky-600/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-bold">Week +{h}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                        Target: W{targetSample ? targetSample.target_week : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* District Tier Counts for Horizon */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-2 bg-slate-950 border border-rose-900/60 rounded-xl px-3 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span className="text-slate-400">Extreme:</span>
                  <span className="font-mono font-bold text-rose-400">{horizonTierCounts.Extreme}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 border border-orange-900/60 rounded-xl px-3 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="text-slate-400">High:</span>
                  <span className="font-mono font-bold text-orange-400">{horizonTierCounts.High}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 border border-amber-900/60 rounded-xl px-3 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-400">Moderate:</span>
                  <span className="font-mono font-bold text-amber-400">{horizonTierCounts.Moderate}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 border border-sky-900/60 rounded-xl px-3 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  <span className="text-slate-400">Low:</span>
                  <span className="font-mono font-bold text-sky-400">{horizonTierCounts.Low}</span>
                </div>

                {horizonTierCounts['Insufficient Data'] > 0 && (
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-500 border border-dashed border-slate-300"></span>
                    <span className="text-slate-400">No Data:</span>
                    <span className="font-mono font-bold text-slate-300">
                      {horizonTierCounts['Insufficient Data']}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Interactive Grid: Left Choropleth Map and Right Allocation Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Choropleth Map */}
              <div className="lg:col-span-5">
                <ChoroplethMap
                  districtTiers={districtTiers}
                  selectedDistrict={selectedDistrict}
                  onSelectDistrict={setSelectedDistrict}
                  selectedHorizon={selectedHorizon}
                />
              </div>

              {/* Right Column: Ranked Vector-Control Allocation Matrix */}
              <div className="lg:col-span-7">
                <AllocationTable
                  rows={allocationList}
                  selectedDistrict={selectedDistrict}
                  onSelectDistrict={setSelectedDistrict}
                  onExportCSV={handleExportCSV}
                />
              </div>
            </div>

            {/* Bottom Row: Selected District Detail & 4-Week Fan Chart */}
            <div className="space-y-4">
              <FanChart
                districtName={selectedDistrict}
                forecasts={selectedDistrictForecasts}
                recentHistory={selectedDistrictHistory}
                cutoffWeekStr={metadata.data_cutoff_week}
              />

              {/* District Demographic & Environmental Covariates Context Strip */}
              {selectedDistrictForecasts[0] && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Jurisdiction & Province</span>
                      <span className="font-bold text-white text-sm">
                        {selectedDistrictForecasts[0].province} Province
                        {selectedDistrict === 'Kalmunai' && ' (RDHS Health Zone)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Population (2023 COD-PS)</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {((selectedDistrictForecasts[0] as any).population || 500000).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">CPH-2024 Piped Water</span>
                      <span className="font-mono font-bold text-sky-400 text-sm">
                        {(selectedDistrictForecasts[0] as any).piped_water_pct || 35.0}%
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Historical Q95 Baseline</span>
                      <span className="font-mono font-bold text-rose-400 text-sm">
                        {selectedDistrictForecasts[0].threshold_q95} cases/week
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Selected Model</span>
                      <span className="font-semibold text-emerald-400 text-sm">
                        Ensemble (GAM + Seasonal-AR)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-5 px-4 mt-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AKARSH</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">ModelX 2.0 Competition</span>
            <span>•</span>
            <span>Team Silent Node • IEEE CIS Student Chapter, IIT</span>
          </div>
          <div className="flex items-center gap-3">
            <span>26,311 Records (2006–2026)</span>
            <span>•</span>
            <span>Open-Meteo ERA5</span>
            <span>•</span>
            <span>Zero Data Leakage Protocol</span>
          </div>
        </div>
      </footer>

      {/* Explainer Modal */}
      <HowToReadModal isOpen={showHowToRead} onClose={() => setShowHowToRead(false)} />
    </div>
  );
}
